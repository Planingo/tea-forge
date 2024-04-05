import { gql, useMutation, useQuery } from "@apollo/client";
import { Module as HasuraModule } from '../../Types/Hasura/module.js';
import { Pathway_Module as HasuraPathway_Module } from "../../Types/Hasura/pathway_module.js";
import { Module } from '../../Types/module.js';

const getModulesQuerie = gql`
    query modules {
        module(order_by: {name: asc}, where: {archived: {_eq: false}}) {
            id
            name
            pathway_modules {
              id
              pathway {
                id
                name
              }
            }
        }
    }
`

export const useModules_tea = () => {
	const {data, ...result} = useQuery(getModulesQuerie)
    const modules: Module[] = data?.module.map((module: HasuraModule) => ({
        id: module.id,
        name: module.name,
        pathways: module.pathway_modules?.map((pathway_module: HasuraPathway_Module) => pathway_module.pathway),
        tags: [],
        actions:{
            downloadTitle: `Télécharger le calendrier pour ${module.name}`,
            cloudTitle: `Envoyer le calendrier à ${module.name}`,
            deleteTitle: `Supprimer le module ${module.name}`,
        },
        link: `/modules/${module.id}`,
        alt: module.name,
        src: `https://avatars.bugsyaya.dev/150/${module.id}`,
    }))

    return {modules, ...result}
}

export const useAddOneModule = () => {
    const [addOneModule, result] = useMutation(gql`
        mutation addOneModule($name: String) {
            insert_module_one(object: {name: $name}) {
                id
            }
        }
    `,
    {
        refetchQueries: [
            {
                query: getModulesQuerie,
            },
        ],
    },
    )

	return [(module: HasuraModule) => {
        return (addOneModule({ variables: module }))}, result]
}
