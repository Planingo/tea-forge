import { gql, useMutation, useQuery } from "@apollo/client"
import { Professor as HasuraProfessor } from "../../Types/Hasura/professor.js"
import { Professor } from "../../Types/professor.js"

const getProfessorsQuerie = gql`
  query professors {
    professor(
      order_by: { user: { lastname: asc } }
      where: { archived: { _eq: false }, user: { archived: { _eq: false } } }
    ) {
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

const toProfessor = (professor: HasuraProfessor | undefined | null): Professor | null => {
  if (!professor) return null

  return {
    id: professor.id,
    name: `${professor.user.lastname?.toUpperCase()} ${professor.user.firstname}`,
    firstname: professor.user.firstname,
    lastname: professor.user.lastname?.toUpperCase(),
    email: professor.user.account?.email,
    tags: [],
    actions: {
      downloadTitle: {
        id: "Télécharger le calendrier pour",
        values: `${professor.user.lastname?.toUpperCase()} ${professor.user.firstname}`,
      },
      cloudTitle: {
        id: "Envoyer le calendrier",
        values: `${professor.user.lastname?.toUpperCase()} ${professor.user.firstname}`,
      },
      deleteTitle: {
        id: "Archiver le professor",
        values: `${professor.user.lastname?.toUpperCase()} ${professor.user.firstname}`,
      },
    },
    link: `/professors/${professor.user.id}`,
    alt: `${professor.user.lastname?.toUpperCase()} ${professor.user.firstname}`,
    photo: `https://avatars.bugsyaya.dev/150/${professor.user.id}`,
  }
}

const toProfessors = (professors: HasuraProfessor[]) => {
  return professors?.map((professor: HasuraProfessor) => toProfessor(professor))
}

export const useProfessors = () => {
  const { data, ...result } = useQuery(getProfessorsQuerie)

  const professors = toProfessors(data?.professor)
  return { professors, ...result }
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
      mutation addOneProfessor($firstname: String, $lastname: String, $email: String) {
        insert_professor_one(
          object: {
            user: {
              data: {
                firstname: $firstname
                lastname: $lastname
                account: { data: { email: $email } }
              }
            }
          }
        ) {
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
      refetchQueries: [
        {
          query: getProfessorsQuerie,
        },
      ],
    }
  )

  return [
    (professor: HasuraProfessor) => {
      return addOneProfessor({ variables: professor })
    },
    result,
  ]
}
