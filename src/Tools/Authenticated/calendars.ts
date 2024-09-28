import { gql, useMutation, useQuery } from "@apollo/client"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Calendar } from "../../Types/calendar.js"
import { Calendar as HasuraCalendar } from "../../Types/Hasura/calendar.js"
import { toEvent } from "./event.js"
import { toPathway } from "./pathways.js"

const SEARCH_CALENDARS = gql`
  query getAllCalendars($condition: calendar_bool_exp!) {
    calendar(where: { _and: [$condition] }, order_by: { name: asc }) {
      id
      name
      archived
      pathway_calendars {
        id
        pathway {
          id
          name
        }
      }
    }
  }
`

const getCalendarById = gql`
  query calendar_by_pk($id: uuid!) {
    calendar_by_pk(id: $id) {
      id
      name
      pathway_calendars {
        id
        pathway {
          id
          name
          pathway_lessons {
            lesson {
              id
              name
              start_date
              end_date
              module_lessons {
                id
                module {
                  id
                  name
                }
              }
            }
          }
          sub_pathways_parent {
            id
            pathway_children {
              id
              name
              pathway_lessons {
                id
                lesson {
                  id
                  name
                  start_date
                  end_date
                  module_lessons {
                    id
                    module {
                      id
                      name
                    }
                  }
                }
              }
              sub_pathways_parent {
                id
                pathway_children {
                  id
                  name
                  pathway_lessons {
                    id
                    lesson {
                      id
                      name
                      start_date
                      end_date
                      module_lessons {
                        id
                        module {
                          id
                          name
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          sub_pathways_children {
            id
            pathway_parent {
              id
              name
              pathway_lessons {
                id
                lesson {
                  id
                  name
                  start_date
                  end_date
                  module_lessons {
                    id
                    module {
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
                  pathway_lessons {
                    id
                    lesson {
                      id
                      name
                      start_date
                      end_date
                      module_lessons {
                        id
                        module {
                          id
                          name
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`

export const toCalendar = (calendar: HasuraCalendar): Calendar => {
  return {
    id: calendar?.id,
    name: calendar?.name?.toUpperCase(),
    archived: calendar?.archived,
    pathway: calendar?.pathway_calendars && toPathway(calendar?.pathway_calendars[0]?.pathway),
    events: calendar?.pathway_calendars
      ?.flatMap((pathway_calendar) =>
        pathway_calendar?.pathway?.pathway_lessons?.map((pathway_lesson) =>
          toEvent(
            {
              ...pathway_lesson?.lesson,
              name: `${pathway_calendar?.pathway?.name} - ${pathway_lesson?.lesson?.name}`,
            },
            pathway_lesson?.lesson?.module_lessons &&
              pathway_lesson?.lesson?.module_lessons[0]?.module
          )
        )
      )
      .concat(
        calendar?.pathway_calendars?.flatMap((pathway_calendar) =>
          pathway_calendar?.pathway?.sub_pathways_children?.flatMap((sub_pathway_children) =>
            sub_pathway_children?.pathway_parent?.pathway_lessons?.map((pathway_lesson) =>
              toEvent(
                {
                  ...pathway_lesson?.lesson,
                  name: `${sub_pathway_children?.pathway_parent?.name} - ${pathway_lesson?.lesson?.name}`,
                },
                pathway_lesson?.lesson?.module_lessons &&
                  pathway_lesson?.lesson?.module_lessons[0]?.module
              )
            )
          )
        )
      )
      .concat(
        calendar?.pathway_calendars?.flatMap((pathway_calendar) =>
          pathway_calendar?.pathway?.sub_pathways_children?.flatMap((sub_pathway_children) =>
            sub_pathway_children?.pathway_parent?.sub_pathways_children?.flatMap((sub_pathway_c) =>
              sub_pathway_c?.pathway_parent?.pathway_lessons?.flatMap((p_l) =>
                toEvent(
                  {
                    ...p_l?.lesson,
                    name: `${sub_pathway_c?.pathway_parent?.name} - ${p_l?.lesson?.name}`,
                  },
                  p_l?.lesson?.module_lessons && p_l?.lesson?.module_lessons[0]?.module
                )
              )
            )
          )
        )
      )
      .concat(
        calendar?.pathway_calendars?.flatMap((pathway_calendar) =>
          pathway_calendar?.pathway?.sub_pathways_parent?.flatMap((sub_pathway_parent) =>
            sub_pathway_parent?.pathway_children?.pathway_lessons?.map((pathway_lesson) =>
              toEvent(
                {
                  ...pathway_lesson?.lesson,
                  name: `${sub_pathway_parent?.pathway_children?.name} - ${pathway_lesson?.lesson?.name}`,
                },
                pathway_lesson?.lesson?.module_lessons &&
                  pathway_lesson?.lesson?.module_lessons[0]?.module
              )
            )
          )
        )
      )
      .concat(
        calendar?.pathway_calendars?.flatMap((pathway_calendar) =>
          pathway_calendar?.pathway?.sub_pathways_parent?.flatMap((sub_pathway_parent) =>
            sub_pathway_parent?.pathway_children?.sub_pathways_parent?.flatMap((sub_pathway_p) =>
              sub_pathway_p?.pathway_children?.pathway_lessons?.flatMap((p_l) =>
                toEvent(
                  {
                    ...p_l?.lesson,
                    name: `${sub_pathway_p?.pathway_children?.name} - ${p_l?.lesson?.name}`,
                  },
                  p_l?.lesson?.module_lessons && p_l?.lesson?.module_lessons[0]?.module
                )
              )
            )
          )
        )
      ),
    actions: {
      downloadTitle: {
        id: "download.calendar.calendar",
        values: `${calendar?.name.toUpperCase()}`,
      },
      cloudTitle: {
        id: "send.calendar.calendar",
        values: `${calendar?.name.toUpperCase()}`,
      },
      deleteTitle: {
        id: "archived.calendar",
        values: `${calendar?.name.toUpperCase()}`,
      },
    },
    link: `/calendars/${calendar?.id}`,
    alt: `${calendar?.name?.toUpperCase()}`,
    photo: `https://avatars.bugsyaya.dev/150/${calendar?.id}`,
  }
}

export const toCalendars = (calendars: HasuraCalendar[]) => {
  return calendars?.map((calendar: HasuraCalendar) => toCalendar(calendar))
}

export const useAddOneCalendar = () => {
  const [addOneCalendar, result] = useMutation(
    gql`
      mutation addOneCalendar($firstname: String, $lastname: String, $email: String) {
        insert_calendar_one(
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
      refetchQueries: ["getAllCalendars"],
    }
  )

  return [
    (calendar: HasuraCalendar) => {
      return addOneCalendar({ variables: calendar })
    },
    result,
  ]
}

export const useSearchCalendars = () => {
  const [searchQuery, setSearchQuery] = useState<any>({
    variables: {
      condition: { archived: { _eq: false } },
    },
  })

  const { data, ...result } = useQuery(SEARCH_CALENDARS, searchQuery)

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
          pathway_calendars: id ? { pathway: { id: { _eq: id } } } : undefined,
        },
      },
    })
  }

  const calendars = toCalendars(data?.calendar)
  return { onSearch, filterByArchived, filterByPathway, calendars, ...result }
}

export const useGetCalendarById = (id: string) => {
  const { data, ...result } = useQuery(getCalendarById, {
    variables: { id: id },
  })

  const c = toCalendar(data?.calendar_by_pk)
  return { calendar: c, ...result }
}

export const useCountCalendar = () => {
  const { data, ...result } = useQuery(gql`
    query count {
      calendar_aggregate {
        aggregate {
          count
        }
      }
    }
  `)

  return { count: data?.calendar_aggregate.aggregate.count, ...result }
}
