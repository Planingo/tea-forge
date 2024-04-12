import { gql, useMutation, useQuery } from "@apollo/client"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Professor as HasuraProfessor } from "../../Types/Hasura/professor.js"
import { Professor } from "../../Types/professor.js"

const getProfessorById = gql`
  query professor_by_pk($id: uuid!) {
    professor_by_pk(id: $id) {
      id
      user {
        lastname
        firstname
        id
        account {
          id
          email
        }
      }
    }
  }
`

const SEARCH_PROFESSORS = gql`
  query getAllProfessors(
    $searchText: String
    $searchText2: String
    $condition: professor_bool_exp!
  ) {
    professor(
      where: {
        _and: [
          {
            user: {
              _or: [
                { firstname: { _ilike: $searchText } }
                { lastname: { _ilike: $searchText2 } }
                { firstname: { _ilike: $searchText2 } }
                { lastname: { _ilike: $searchText } }
              ]
            }
          }
          $condition
        ]
      }
      order_by: { user: { lastname: asc } }
    ) {
      id
      archived
      user {
        lastname
        firstname
        id
        account {
          id
          email
        }
      }
    }
  }
`

const toProfessor = (professor: HasuraProfessor): Professor => {
  return {
    id: professor.id,
    name: `${professor.user.lastname?.toUpperCase()} ${professor.user.firstname}`,
    firstname: professor.user.firstname,
    lastname: professor.user.lastname?.toUpperCase(),
    email: professor.user.account?.email,
    tags: [],
    archived: professor?.archived,
    actions: {
      downloadTitle: {
        id: "download.calendar.professor",
        values: `${professor.user.lastname?.toUpperCase()} ${professor.user.firstname}`,
      },
      cloudTitle: {
        id: "send.calendar.professor",
        values: `${professor.user.lastname?.toUpperCase()} ${professor.user.firstname}`,
      },
      deleteTitle: {
        id: "archived.professor",
        values: `${professor.user.lastname?.toUpperCase()} ${professor.user.firstname}`,
      },
    },
    link: `/professors/${professor.user.id}`,
    alt: `${professor.user.lastname?.toUpperCase()} ${professor.user.firstname}`,
    photo: `https://avatars.bugsyaya.dev/150/${professor.user.id}`,
  }
}

export const toProfessors = (professors: HasuraProfessor[]) => {
  return professors?.map((professor: HasuraProfessor) => toProfessor(professor))
}

export const useSearchProfessors = () => {
  const [searchQuery, setSearchQuery] = useState<any>({
    variables: {
      searchText: "%%",
      searchText2: "",
      condition: { archived: { _eq: false } },
    },
  })

  const { data, ...result } = useQuery(SEARCH_PROFESSORS, searchQuery)

  const onSearch = useDebouncedCallback((searchText: string) => {
    const searchsTmp = searchText.split(" ").map((st: string) => `%${st}%`)

    if (searchText)
      setSearchQuery({
        variables: {
          ...searchQuery.variables,
          searchText: searchsTmp[0],
          searchText2: searchsTmp[1] || "",
        },
      })
    else
      setSearchQuery({
        variables: {
          ...searchQuery.variables,
          searchText: "%%",
          searchText2: "",
        },
      })
  }, 500)

  const filterByArchived = (archived: string | boolean) => {
    setSearchQuery({
      variables: {
        ...searchQuery.variables,
        condition: {
          ...searchQuery.variables.condition,
          archived: { _eq: archived === "all" ? undefined : archived },
        },
      },
    })
  }

  const professors = toProfessors(data?.professor)?.filter((professor) =>
    searchQuery?.variables?.condition?.archived?._eq !== undefined
      ? professor?.archived === searchQuery?.variables?.condition?.archived?._eq
      : professor
  )

  return {
    onSearch,
    professors,
    filterByArchived,
    ...result,
  }
}

export const useGetProfessorById = (id: string) => {
  const { data, ...result } = useQuery(getProfessorById, {
    variables: { id: id },
  })
  const p = toProfessor(data?.professor_by_pk)
  return { professor: p, ...result }
}

export const useAddOneProfessor = () => {
  const [addOneProfessor, result] = useMutation(
    gql`
      mutation addOneProfessor($condition: professor_insert_input!) {
        insert_professor_one(object: $condition) {
          id
          user {
            id
            account {
              id
            }
          }
        }
      }
    `,
    {
      refetchQueries: ["getAllProfessors"],
    }
  )

  return [
    (professor: any) => {
      return addOneProfessor({
        variables: {
          condition: {
            user: {
              data: {
                firstname: professor.firstname,
                lastname: professor.lastname,
                account: { data: { email: professor.email } },
              },
            },
          },
        },
      })
    },
    result,
  ]
}

export const useArchivedById = () => {
  const [archivedOneProfessor, result] = useMutation(
    gql`
      mutation archivedOneProfessor($id: uuid!) {
        update_professor_by_pk(pk_columns: { id: $id }, _set: { archived: true }) {
          id
          archived
          updated_at
          created_at
        }
      }
    `,
    {
      refetchQueries: ["getAllProfessors"],
    }
  )

  return [
    (id: string) => {
      return archivedOneProfessor({ variables: { id: id } })
    },
    result,
  ] as const
}
