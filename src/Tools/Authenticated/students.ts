import { gql, useMutation, useQuery } from "@apollo/client"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Student as HasuraStudent } from "../../Types/Hasura/student.js"
import { Student_Pathways } from "../../Types/Hasura/student_pathways.js"
import { Event } from "../../Types/event.js"
import { Student } from "../../Types/student.js"
import { toCalendars } from "./calendars.js"
import { toCompany } from "./companies.js"
import { toEvent } from "./event.js"
import { toPathways } from "./pathways.js"

const userFragment = gql`
  fragment userFragment on student {
    user {
      lastname
      firstname
      id
      account {
        id
        email
      }
    }
  }
`

const pathwayFragment = gql`
  fragment pathwayFragment on student {
    student_pathways {
      id
      pathway {
        id
        name
      }
    }
  }
`

const calendarFragment = gql`
  fragment calendarFragment on student {
    student_pathways {
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
                  }
                }
              }
            }
          }
        }
        pathway_calendars {
          id
          calendar {
            id
            name
          }
        }
      }
    }
  }
`

const SEARCH_STUDENTS = gql`
  query getAllStudents($condition: student_bool_exp!) {
    student(where: { _and: [$condition] }, order_by: { user: { lastname: asc } }) {
      id
      archived
      ...userFragment
      ...pathwayFragment
      student_companies {
        id
        company {
          id
          name
        }
      }
    }
  }
  ${userFragment}
  ${pathwayFragment}
`

const getStudentById = gql`
  query student_by_pk($id: uuid!) {
    student_by_pk(id: $id) {
      id
      archived
      student_companies {
        id
        company {
          id
          name
        }
      }
      ...userFragment
      ...calendarFragment
    }
  }
  ${calendarFragment}
  ${userFragment}
`

const studentToEvents = (studentPathways: Student_Pathways[]): Event[] => {
  return studentPathways
    ?.flatMap((student_pathway) =>
      student_pathway?.pathway?.pathway_lessons?.map((pathway_lesson) =>
        toEvent(pathway_lesson?.lesson)
      )
    )
    .concat(
      studentPathways?.flatMap((student_pathway) =>
        student_pathway?.pathway?.sub_pathways_children?.flatMap((sub_pathway_children) =>
          sub_pathway_children?.pathway_parent?.pathway_lessons?.map((pathway_lesson) =>
            toEvent(pathway_lesson?.lesson)
          )
        )
      )
    )
    .concat(
      studentPathways?.flatMap((student_pathway) =>
        student_pathway?.pathway?.sub_pathways_parent?.flatMap((sub_pathway_parent) =>
          sub_pathway_parent?.pathway_children?.pathway_lessons?.map((pathway_lesson) =>
            toEvent(pathway_lesson?.lesson)
          )
        )
      )
    )
    .concat(
      studentPathways?.flatMap((student_pathway) =>
        student_pathway?.pathway?.sub_pathways_children?.flatMap((sub_pathway_children) =>
          sub_pathway_children?.pathway_parent?.sub_pathways_children?.flatMap((sub_pathway_c) =>
            sub_pathway_c?.pathway_parent?.pathway_lessons?.flatMap((p_l) => toEvent(p_l?.lesson))
          )
        )
      )
    )
    .concat(
      studentPathways?.flatMap((student_pathways) =>
        student_pathways?.pathway?.sub_pathways_parent?.flatMap((sub_pathway_parent) =>
          sub_pathway_parent?.pathway_children?.sub_pathways_parent?.flatMap((sub_pathway_p) =>
            sub_pathway_p?.pathway_children?.pathway_lessons?.flatMap((p_l) => toEvent(p_l?.lesson))
          )
        )
      )
    )
}

const toStudent = (student: HasuraStudent): Student => {
  return {
    id: student?.id,
    name: `${student?.user.lastname?.toUpperCase()} ${student?.user.firstname}`,
    firstname: student?.user.firstname,
    lastname: student?.user.lastname?.toUpperCase(),
    email: student?.user.account?.email,
    pathways: toPathways(
      student?.student_pathways?.map((student_pathway) => student_pathway.pathway)
    ),
    calendars: toCalendars(
      student?.student_pathways?.flatMap((student_pathway) =>
        student_pathway?.pathway?.pathway_calendars?.map(
          (pathway_calendar) => pathway_calendar?.calendar
        )
      )
    ),
    archived: student?.archived,
    events: studentToEvents(student?.student_pathways),
    companies: student?.student_companies?.map((student_company) =>
      toCompany(student_company.company)
    ),
    tags: [],
    actions: {
      downloadTitle: {
        id: "download.calendar.student",
        values: `${student?.user.lastname?.toUpperCase()} ${student?.user.firstname}`,
      },
      cloudTitle: {
        id: "send.calendar.student",
        values: `${student?.user.lastname?.toUpperCase()} ${student?.user.firstname}`,
      },
      deleteTitle: {
        id: "archived.student",
        values: `${student?.user.lastname?.toUpperCase()} ${student?.user.firstname}`,
      },
    },
    link: `/students/${student?.user.id}`,
    alt: `${student?.user.lastname?.toUpperCase()} ${student?.user.firstname}`,
    photo: `https://avatars.bugsyaya.dev/150/${student?.user.id}`,
  }
}

const toStudents = (students: HasuraStudent[]) => {
  return students?.map((student: HasuraStudent) => toStudent(student))
}

export const useAddOneStudent = () => {
  const [addOneStudent, result] = useMutation(
    gql`
      mutation addOneStudent($condition: student_insert_input!) {
        insert_student_one(object: $condition) {
          id
          user {
            id
            account {
              id
            }
          }
          student_pathways {
            id
            pathway {
              id
              name
            }
          }
        }
      }
    `,
    {
      refetchQueries: ["getAllStudents"],
    }
  )

  return [
    (student: any) => {
      return addOneStudent({
        variables: {
          condition: {
            user: {
              data: {
                firstname: student.firstname,
                lastname: student.lastname,
                account: { data: { email: student.email } },
              },
            },
            student_pathways: { data: { pathway_id: student.pathway_id } },
            student_calendars: student.calendar
              ? { data: { calendar_id: student.calendar } }
              : undefined,
            student_companies: student.company
              ? { data: { company_id: student.company } }
              : undefined,
          },
        },
      })
    },
    result,
  ]
}

export const useSearchStudents = () => {
  const [searchQuery, setSearchQuery] = useState<any>({
    variables: {
      condition: { archived: { _eq: false } },
    },
  })

  const { data, ...result } = useQuery(SEARCH_STUDENTS, searchQuery)

  const filterByPathway = (id?: string[]) => {
    setSearchQuery({
      variables: {
        condition: {
          ...searchQuery.variables.condition,
          student_pathways: id?.length
            ? {
                _and: {
                  pathway: { archived: { _eq: false } },
                  pathway_id: { _in: id },
                },
              }
            : undefined,
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
          student_calendars: id ? { calendar: { id: { _eq: id } } } : undefined,
        },
      },
    })
  }

  const filterByCompany = (id?: string) => {
    setSearchQuery({
      variables: {
        ...searchQuery.variables,
        condition: {
          ...searchQuery.variables.condition,
          student_companies: id ? { company: { id: { _eq: id } } } : undefined,
        },
      },
    })
  }

  const filterByArchived = (archived?: boolean) => {
    setSearchQuery({
      variables: {
        condition: {
          ...searchQuery.variables.condition,
          archived: { _eq: archived === null ? undefined : archived },
        },
      },
    })
  }

  const search = useDebouncedCallback((searchText?: string) => {
    setSearchQuery({
      variables: {
        condition: {
          ...searchQuery.variables.condition,
          user: searchText
            ? {
                _or: searchText
                  .split(" ")
                  .filter((st) => st !== "")
                  .flatMap((st) => [
                    {
                      firstname: {
                        _ilike: `%${st}%`,
                      },
                    },
                    { lastname: { _ilike: `%${st}%` } },
                  ]),
              }
            : undefined,
        },
      },
    })
  }, 500)

  const students = toStudents(data?.student)?.filter(
    (student) =>
      student?.archived !== null ??
      student?.archived === searchQuery?.variables?.condition?.archived?._eq
  )

  return {
    search,
    students,
    filterByPathway,
    filterByArchived,
    filterByCalendar,
    filterByCompany,
    ...result,
  }
}

export const useGetStudentById = (id: string) => {
  const { data, ...result } = useQuery(getStudentById, {
    variables: { id: id },
  })

  const s = toStudent(data?.student_by_pk)
  return { student: s, ...result }
}

export const useCountStudent = () => {
  const { data, ...result } = useQuery(gql`
    query count {
      student_aggregate {
        aggregate {
          count
        }
      }
    }
  `)

  return { count: data?.student_aggregate.aggregate.count, ...result }
}

export const useArchivedById = () => {
  const [archivedOneStudent, result] = useMutation(
    gql`
      mutation archivedOneStudent($id: uuid!) {
        update_student_by_pk(pk_columns: { id: $id }, _set: { archived: true }) {
          id
          archived
          updated_at
          created_at
        }
      }
    `,
    {
      refetchQueries: ["getAllStudents"],
    }
  )

  return [
    (id: string) => {
      return archivedOneStudent({ variables: { id: id } })
    },
    result,
  ] as const
}
