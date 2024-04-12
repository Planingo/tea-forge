import { gql, useMutation, useQuery } from "@apollo/client"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Company as HasuraCompany } from "../../Types/Hasura/company.js"
import { Company } from "../../Types/company.js"

const getCompanyById = gql`
  query company_by_pk($id: uuid!) {
    company_by_pk(id: $id) {
      id
      name
      archived
      student_companies {
        id
        student {
          id
        }
      }
    }
  }
`

const SEARCH_COMPANIES = gql`
  query getAllCompanies($condition: company_bool_exp!) {
    company(where: { _and: [$condition] }, order_by: { name: asc }) {
      id
      name
      archived
      student_companies {
        id
        student {
          id
        }
      }
    }
  }
`

export const toCompany = (company: HasuraCompany): Company => {
  return {
    id: company?.id,
    name: company?.name,
    archived: company?.archived,
    tags: [],
    events: [],
    student_number:
      company?.student_companies?.map((student_company) => student_company?.student)?.length || 0,
    actions: {
      downloadTitle: { id: `download.calendar.company`, values: company?.name },
      cloudTitle: { id: `send.calendar.company`, values: company?.name },
      deleteTitle: { id: `archived.company`, values: company?.name },
    },
    link: `/companies/${company?.id}`,
    alt: company?.name,
    photo: `https://avatars.bugsyaya.dev/150/${company?.id}`,
  }
}

export const toCompanies = (companies: HasuraCompany[]): Company[] => {
  return companies?.map((company: HasuraCompany) => toCompany(company))
}

export const useSearchCompanies = () => {
  const [searchQuery, setSearchQuery] = useState<any>({
    variables: {
      condition: { archived: { _eq: false } },
    },
  })

  const { data, ...result } = useQuery(SEARCH_COMPANIES, searchQuery)

  const filterByArchived = (archived: string | boolean) => {
    setSearchQuery({
      variables: {
        condition: {
          ...searchQuery.variables.condition,
          archived: { _eq: archived === "all" ? undefined : archived },
        },
      },
    })
  }

  const onSearch = useDebouncedCallback((searchText?: string) => {
    setSearchQuery({
      variables: {
        condition: {
          ...searchQuery.variables.condition,
          name: searchText ? { _ilike: `%${searchText}%` } : undefined,
        },
      },
    })
  }, 500)

  const companies = toCompanies(data?.company)?.filter((company) =>
    searchQuery?.variables?.condition?.archived?._eq !== undefined
      ? company?.archived === searchQuery?.variables?.condition?.archived?._eq
      : company
  )

  return {
    onSearch,
    companies,
    filterByArchived,
    ...result,
  }
}

export const useAddOneCompany = () => {
  const [addOneCompany, result] = useMutation(
    gql`
      mutation addOneCompany($name: String) {
        insert_company_one(object: { name: $name }) {
          id
        }
      }
    `,
    {
      refetchQueries: ["getAllCompanies"],
    }
  )

  return [
    (company: any) => {
      return addOneCompany({ variables: company })
    },
    result,
  ]
}

export const useArchivedById = () => {
  const [archivedOneCompany, result] = useMutation(
    gql`
      mutation archivedOneCompany($id: uuid!) {
        update_company_by_pk(pk_columns: { id: $id }, _set: { archived: true }) {
          id
        }
      }
    `,
    {
      refetchQueries: ["getAllCompanies"],
    }
  )

  return [
    (id: string) => {
      return archivedOneCompany({ variables: { id: id } })
    },
    result,
  ] as const
}

export const useGetCompanyById = (id: string) => {
  const { data, ...result } = useQuery(getCompanyById, {
    variables: { id: id },
  })

  const c = toCompany(data?.company_by_pk)
  return { company: c, ...result }
}
