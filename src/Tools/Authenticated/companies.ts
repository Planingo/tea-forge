import { gql, useMutation, useQuery } from "@apollo/client"
import { Company as HasuraCompany } from "../../Types/Hasura/company.js"
import { Company } from "../../Types/company.js"

const getCompaniesQuerie = gql`
  query companies {
    company(order_by: { name: asc }, where: { archived: { _eq: false } }) {
      id
      name
    }
  }
`

export const toCompany = (company: HasuraCompany): Company => {
  return {
    id: company.id,
    name: company.name,
    tags: [],
    actions: {
      downloadTitle: { id: `Télécharger le calendrier pour`, values: company.name },
      cloudTitle: { id: `Envoyer le calendrier à`, values: company.name },
      deleteTitle: { id: `Supprimer l'étudtiant`, values: company.name },
    },
    link: `/companies/${company.id}`,
    alt: company.name,
    photo: `https://avatars.bugsyaya.dev/150/${company.id}`,
  }
}

export const toCompanies = (companies: HasuraCompany[]): Company[] => {
  return companies?.map((company: HasuraCompany) => toCompany(company))
}

export const useCompanies = () => {
  const { data, ...result } = useQuery(getCompaniesQuerie)
  const companies: Company[] = toCompanies(data?.company)

  return { companies, ...result }
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
      refetchQueries: [
        {
          query: getCompaniesQuerie,
        },
      ],
    }
  )

  return [
    (company: HasuraCompany) => {
      return addOneCompany({ variables: company })
    },
    result,
  ]
}
