import { gql, useMutation, useQuery } from "@apollo/client"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Pathway as HasuraPathway } from "../../Types/Hasura/pathway.js"
import { Pathway_Children } from "../../Types/Hasura/pathway_children.js"
import { Pathway_Parent } from "../../Types/Hasura/pathway_parent.js"
import { Pathway } from "../../Types/pathway.js"
import { toCalendars } from "./calendars.js"
import { toEvent } from "./event.js"

const getPathwayById = gql`
  query pathway_by_pk($id: uuid!) {
    pathway_by_pk(id: $id) {
      id
      name
      archived
      pathway_calendars {
        id
        calendar {
          id
          name
          module_calendars {
            id
            module {
              id
              name
              module_lessons {
                id
                lesson {
                  end_date
                  id
                  name
                  start_date
                }
              }
            }
          }
        }
      }
      pathway_modules {
        id
        module {
          id
          name
          module_lessons {
            id
            lesson {
              archived
              end_date
              id
              name
              start_date
            }
          }
        }
      }
      student_pathways {
        id
        student {
          id
          user {
            id
            firstname
            lastname
          }
        }
      }
    }
  }
`

const SEARCH_PATHWAYS = gql`
  query getAllPathways($condition: pathway_bool_exp!) {
    pathway(where: { _and: [$condition] }, order_by: { name: asc }) {
      id
      name
      archived
      sub_pathways_parent {
        id
        pathway_children {
          id
          name
          archived
          sub_pathways_parent {
            id
            pathway_children {
              id
              name
            }
          }
        }
      }
      sub_pathways_children {
        id
        pathway_parent {
          id
          name
          archived
          sub_pathways_children {
            id
            pathway_parent {
              id
              name
              archived
            }
          }
        }
      }
      pathway_calendars {
        id
        calendar {
          id
          name
          module_calendars {
            id
            module {
              id
              name
              module_lessons {
                id
                lesson {
                  end_date
                  id
                  name
                  start_date
                }
              }
            }
          }
        }
      }
      pathway_modules {
        id
        module {
          id
          name
          module_lessons {
            id
            lesson {
              archived
              end_date
              id
              name
              start_date
            }
          }
        }
      }
      student_pathways {
        id
        student {
          id
          user {
            id
            firstname
            lastname
          }
        }
      }
    }
  }
`

export const toPathways = (pathways: HasuraPathway[]): Pathway[] => {
  return pathways?.map((pathway: HasuraPathway) => toPathway(pathway))
}

export const toPathway = (pathway: HasuraPathway | Pathway_Parent | Pathway_Children): Pathway => {
  return {
    id: pathway?.id,
    name: pathway?.name,
    archived: pathway?.archived,
    parent_pathway: pathway?.sub_pathways_children?.map((sub_pathway_children) =>
      toPathway(sub_pathway_children?.pathway_parent)
    )[0],
    children_pathway: pathway?.sub_pathways_parent?.map((sub_pathway_parent) =>
      toPathway(sub_pathway_parent?.pathway_children)
    ),
    tags: [],
    events: pathway?.pathway_calendars?.flatMap((pathway_calendar) =>
      pathway_calendar?.calendar?.module_calendars?.flatMap((module_calendar) =>
        module_calendar?.module?.module_lessons?.map((module_lesson) =>
          toEvent(module_lesson?.lesson, module_calendar?.module)
        )
      )
    ),
    calendars: toCalendars(
      pathway?.pathway_calendars?.map((pathway_calendar) => pathway_calendar?.calendar)
    ),
    actions: {
      downloadTitle: {
        id: "download.calendar.pathway",
        values: `${pathway?.name}`,
      },
      cloudTitle: {
        id: "send.calendar.pathway",
        values: `${pathway?.name}`,
      },
      deleteTitle: {
        id: "archived.pathway",
        values: `${pathway?.name}`,
      },
    },
    link: `/pathways/${pathway?.id}`,
    alt: pathway?.name,
    photo: `https://avatars.bugsyaya.dev/150/${pathway?.id}`,
    student_number: pathway?.student_pathways?.map((student_pathway) => student_pathway?.student)
      ?.length,
  }
}

export const useSearchPathways = () => {
  const [searchQuery, setSearchQuery] = useState<any>({
    variables: {
      condition: { archived: { _eq: false } },
    },
  })

  const { data, ...result } = useQuery(SEARCH_PATHWAYS, searchQuery)

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

  const filterByCalendar = (id?: string) => {
    setSearchQuery({
      variables: {
        condition: {
          ...searchQuery.variables.condition,
          pathway_calendars: id ? { calendar: { id: { _eq: id } } } : undefined,
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

  const pathways = toPathways(data?.pathway)?.filter(
    (pathway) =>
      pathway?.archived !== null ??
      pathway?.archived === searchQuery?.variables?.condition?.archived?._eq
  )

  return {
    onSearch,
    pathways,
    filterByArchived,
    filterByCalendar,
    ...result,
  }
}

export const useAddOnePathway = () => {
  const [addOnePathway, result] = useMutation(
    gql`
      mutation addOnePathway($condition: pathway_insert_input!) {
        insert_pathway_one(object: $condition) {
          id
          name
          archived
          pathway_calendars {
            id
            calendar {
              id
              name
            }
          }
        }
      }
    `,
    {
      refetchQueries: ["getAllPathways"],
    }
  )

  return [
    (pathway: any) => {
      return addOnePathway({
        variables: {
          condition: {
            name: pathway.name,
            pathway_calendars: pathway.calendar
              ? { data: { calendar_id: pathway.calendar } }
              : undefined,
          },
        },
      })
    },
    result,
  ]
}
export const useArchivedById = () => {
  const [archivedOnePathway, result] = useMutation(
    gql`
      mutation archivedOnePathway($id: uuid!) {
        update_pathway_by_pk(pk_columns: { id: $id }, _set: { archived: true }) {
          id
        }
      }
    `,
    {
      refetchQueries: ["getAllPathways"],
    }
  )

  return [
    (id: string) => {
      return archivedOnePathway({ variables: { id: id } })
    },
    result,
  ] as const
}

export const useGetPathwayById = (id?: string) => {
  const { data, ...result } = useQuery(getPathwayById, {
    variables: { id: id },
  })

  const p = toPathway(data?.pathway_by_pk)
  return { pathway: p, ...result }
}
