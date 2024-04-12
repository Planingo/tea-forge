import { gql, useMutation, useQuery } from "@apollo/client"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Pathway as HasuraPathway } from "../../Types/Hasura/pathway.js"
import { Pathway } from "../../Types/pathway.js"

const SEARCH_PATHWAYS = gql`
  query getAllPathways($condition: pathway_bool_exp!) {
    pathway(where: { _and: [$condition] }, order_by: { name: asc }) {
      id
      name
      archived
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
    archived: pathway?.archived,
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

export const useSearchPathways = () => {
  const [searchQuery, setSearchQuery] = useState<any>({
    variables: {
      searchText: "%%",
      searchText2: "",
      condition: { archived: { _eq: false } },
    },
  })

  const { data, ...result } = useQuery(SEARCH_PATHWAYS, searchQuery)

  const filterByArchived = (archived?: boolean) => {
    setSearchQuery({
      variables: {
        ...searchQuery.variables,
        condition: {
          ...searchQuery.variables.condition,
          archived: { _eq: archived === null ? undefined : archived },
        },
      },
    })
  }

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

  const pathways = toPathways(data?.pathway)?.filter(
    (pathway) =>
      pathway?.archived !== null ??
      pathway?.archived === searchQuery?.variables?.condition?.archived?._eq
  )

  return {
    onSearch,
    pathways,
    filterByArchived,
    ...result,
  }
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
      refetchQueries: ["getAllPathways"],
    }
  )

  return [
    (pathway: HasuraPathway) => {
      return addOnePathway({ variables: pathway })
    },
    result,
  ]
}
