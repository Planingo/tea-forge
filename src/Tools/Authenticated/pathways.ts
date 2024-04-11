import { gql, useMutation, useQuery } from "@apollo/client"
import { Pathway as HasuraPathway } from "../../Types/Hasura/pathway.js"
import { Pathway } from "../../Types/pathway.js"

const getPathwaysQuerie = gql`
  query pathways {
    pathway(order_by: { name: asc }, where: { archived: { _eq: false } }) {
      id
      name
    }
  }
`

export const toPathways = (pathways: HasuraPathway[]): Pathway[] => {
  return pathways?.map((pathway: HasuraPathway) => toPathway(pathway))
}

export const toPathway = (pathway: HasuraPathway): Pathway => {
  return {
    id: pathway?.id,
    name: pathway?.name,
    tags: [],
    actions: {
      downloadTitle: {
        id: "Télécharger le calendrier pour",
        values: `${pathway?.name}`,
      },
      cloudTitle: {
        id: "Envoyer le calendrier",
        values: `${pathway?.name}`,
      },
      deleteTitle: {
        id: "Archiver la formation",
        values: `${pathway?.name}`,
      },
    },
    link: `/pathways/${pathway?.id}`,
    alt: pathway?.name,
    photo: `https://avatars.bugsyaya.dev/150/${pathway?.id}`,
  }
}

export const usePathways_tea = () => {
  const { data, ...result } = useQuery(getPathwaysQuerie)
  const pathways: Pathway[] = toPathways(data?.pathway)

  return { pathways, ...result }
}

export const useAddOnePathway = () => {
  const [addOnePathway, result] = useMutation(
    gql`
      mutation addOnePathway($name: String) {
        insert_pathway_one(object: { name: $name }) {
          id
        }
      }
    `,
    {
      refetchQueries: [
        {
          query: getPathwaysQuerie,
        },
      ],
    }
  )

  return [
    (pathway: HasuraPathway) => {
      return addOnePathway({ variables: pathway })
    },
    result,
  ]
}
