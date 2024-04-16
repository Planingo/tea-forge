import { gql, useMutation, useQuery } from "@apollo/client"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Calendar } from "../../Types/calendar.js"
import { Calendar as HasuraCalendar } from "../../Types/Hasura/calendar.js"
import { toEvent } from "./event.js"

const SEARCH_CALENDARS = gql`
  query getAllCalendars($searchText: String) {
    calendar(
      order_by: { name: asc }
      where: { archived: { _eq: false }, _or: { name: { _ilike: $searchText } } }
    ) {
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
    lessons: calendar?.module_calendars,
    name: calendar?.name?.toUpperCase(),
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
        id: "Télécharger le calendrier pour",
        values: `${calendar?.name.toUpperCase()}`,
      },
      cloudTitle: {
        id: "Envoyer le calendrier",
        values: `${calendar?.name.toUpperCase()}`,
      },
      deleteTitle: {
        id: "Archiver le calendrier",
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
  const [searchQuery, setSearchQuery] = useState({
    variables: { searchText: "%%" },
  })

  const { data, ...result } = useQuery(SEARCH_CALENDARS, searchQuery)

  const search = useDebouncedCallback((searchText: string) => {
    const searchsTmp = searchText.split(" ").map((st: string) => `%${st}%`)
    if (searchText) setSearchQuery({ variables: { searchText: searchsTmp[0] } })
    else setSearchQuery({ variables: { searchText: "%%" } })
  }, 500)

  const calendars = toCalendars(data?.calendar)
  return { search, calendars, ...result }
}

export const useGetCalendarById = (id: string) => {
  const { data, ...result } = useQuery(getCalendarById, {
    variables: { id: id },
  })

  const s = toCalendar(data?.calendar_by_pk)
  console.log(s)
  return { calendar: s, ...result }
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
