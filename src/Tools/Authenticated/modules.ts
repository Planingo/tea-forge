import { gql, useMutation, useQuery } from "@apollo/client"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Module as HasuraModule } from "../../Types/Hasura/module.js"
import { Pathway_Module as HasuraPathway_Module } from "../../Types/Hasura/pathway_module.js"
import { Module } from "../../Types/module.js"
import { toCalendars } from "./calendars.js"
import { toPathways } from "./pathways.js"

const getModuleById = gql`
  query module_by_pk($id: uuid!) {
    module_by_pk(id: $id) {
      id
      archived
      name
    }
  }
`

const SEARCH_MODULES = gql`
  query getAllModules($condition: module_bool_exp!) {
    module(where: { _and: [$condition] }, order_by: { name: asc }) {
      id
      name
      archived
      module_calendars {
        id
        calendar {
          id
          name
        }
      }
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

export const toModule = (module: HasuraModule): Module => {
  return {
    id: module?.id,
    name: module?.name,
    archived: module?.archived,
    pathways: toPathways(
      module?.pathway_modules?.map((pathway_module: HasuraPathway_Module) => pathway_module.pathway)
    ),
    calendars: toCalendars(
      module?.module_calendars?.map((module_calendar) => module_calendar.calendar)
    ),
    events: [],
    tags: [],
    actions: {
      downloadTitle: {
        id: "download.calendar.module",
        values: `${module?.name}`,
      },
      cloudTitle: {
        id: "send.calendar.module",
        values: `${module?.name}`,
      },
      deleteTitle: {
        id: "archived.module",
        values: `${module?.name}`,
      },
    },
    link: `/modules/${module?.id}`,
    alt: module?.name,
    photo: `https://avatars.bugsyaya.dev/150/${module?.id}`,
  }
}

export const toModules = (modules: HasuraModule[]): Module[] => {
  return modules?.map((module) => toModule(module))
}

export const useSearchModules = () => {
  const [searchQuery, setSearchQuery] = useState<any>({
    variables: {
      condition: { archived: { _eq: false } },
    },
  })

  const { data, ...result } = useQuery(SEARCH_MODULES, searchQuery)

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

  const filterByPathway = (id?: string) => {
    setSearchQuery({
      variables: {
        ...searchQuery.variables,
        condition: {
          ...searchQuery.variables.condition,
          pathway_modules: id ? { pathway: { id: { _eq: id } } } : undefined,
        },
      },
    })
  }

  const filterByCalendar = (id?: string) => {
    setSearchQuery({
      variables: {
        ...searchQuery.variables,
        condition: {
          ...searchQuery.variables.condition,
          module_calendars: id ? { calendar: { id: { _eq: id } } } : undefined,
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

  const modules = toModules(data?.module)?.filter((module) =>
    searchQuery?.variables?.condition?.archived?._eq !== undefined
      ? module?.archived === searchQuery?.variables?.condition?.archived?._eq
      : module
  )

  return {
    onSearch,
    modules,
    filterByArchived,
    filterByPathway,
    filterByCalendar,
    ...result,
  }
}

export const useAddOneModule = () => {
  const [addOneModule, result] = useMutation(
    gql`
      mutation addOneModule($condition: module_insert_input!) {
        insert_module_one(object: $condition) {
          id
        }
      }
    `,
    {
      refetchQueries: ["getAllModules"],
    }
  )

  return [
    (module: any) => {
      return addOneModule({
        variables: {
          condition: {
            name: module.name,
            pathway_modules: { data: { pathway_id: module.pathway } },
          },
        },
      })
    },
    result,
  ]
}

export const useGetModuleById = (id: string) => {
  const { data, ...result } = useQuery(getModuleById, {
    variables: { id: id },
  })

  const m = toModule(data?.module_by_pk)
  return { module: m, ...result }
}

export const useArchivedById = () => {
  const [archivedOneModule, result] = useMutation(
    gql`
      mutation archivedOneModule($id: uuid!) {
        update_module_by_pk(pk_columns: { id: $id }, _set: { archived: true }) {
          id
        }
      }
    `,
    {
      refetchQueries: ["getAllModules"],
    }
  )

  return [
    (id: string) => {
      return archivedOneModule({ variables: { id: id } })
    },
    result,
  ] as const
}
