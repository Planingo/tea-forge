import { gql, useMutation, useQuery } from "@apollo/client";
import { Company as HasuraCompany } from "../../Types/Hasura/company.js";
import { Company } from "../../Types/company.js";

const getCompaniesQuerie = gql`
    query companies {
        company(order_by: {name: asc}, where: {archived: {_eq: false}}) {
            id
            name
        }
    }
`

export const useCompanies = () => {
	const {data, ...result} = useQuery(getCompaniesQuerie)
    const companies: Company = data?.company.map((company: HasuraCompany) => ({
        id: company.id,
        name: company.name,
        tags: [],
        actions: {
            downloadTitle: `Télécharger le calendrier pour ${company.name}`,
            cloudTitle: `Envoyer le calendrier à ${company.name}`,
            deleteTitle: `Supprimer l'étudtiant ${company.name}`,
        },
        link: `/companies/${company.id}`,
        alt: company.name,
        src: `https://avatars.bugsyaya.dev/150/${company.id}`,
    }))

    return {companies, ...result}
}

export const useAddOneCompany = () => {
    const [addOneCompany, result] = useMutation(gql`
        mutation addOneCompany($name: String) {
            insert_company_one(object: {name: $name}) {
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
    },
    )

	return [(company: HasuraCompany) => {
        return (addOneCompany({ variables: company }))}, result]
}
