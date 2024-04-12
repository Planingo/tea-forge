import { gql, useMutation, useQuery } from "@apollo/client"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Lesson as HasuraLesson } from "../../Types/Hasura/lesson.js"
import { Module as HasuraModule } from "../../Types/Hasura/module.js"
import { Student as HasuraStudent } from "../../Types/Hasura/student.js"
import { Student } from "../../Types/student.js"
import { toCalendars } from "./calendars.js"
import { toCompany } from "./companies.js"
import { toEvent } from "./event.js"
import { toPathways } from "./pathways.js"

const calendarFragment = gql`
  fragment calendarFragment on student {
    student_calendars {
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
                id
                name
                end_date
                start_date
              }
            }
          }
        }
      }
    }
  }
`

const SEARCH_STUDENTS = gql`
  query getAllStudents($searchText: String, $searchText2: String, $condition: student_bool_exp!) {
    student(
      where: {
        _and: [
          {
            user: {
              _or: [
                { firstname: { _ilike: $searchText } }
                { lastname: { _ilike: $searchText2 } }
                { firstname: { _ilike: $searchText2 } }
                { lastname: { _ilike: $searchText } }
              ]
            }
          }
          $condition
        ]
      }
      order_by: { user: { lastname: asc } }
    ) {
      id
      archived
      user {
        lastname
        firstname
        id
        account {
          id
          email
        }
      }
      student_pathways {
        id
        pathway {
          id
          name
        }
      }
      student_companies {
        id
        company {
          id
          name
        }
      }
      ...calendarFragment
    }
  }
  ${calendarFragment}
`

const getStudentById = gql`
  query student_by_pk($id: uuid!) {
    student_by_pk(id: $id) {
      id
      archived
      user {
        lastname
        firstname
        id
        account {
          id
          email
        }
      }
      student_pathways {
        id
        pathway {
          id
          name
        }
      }
      student_companies {
        id
        company {
          id
          name
        }
      }
      ...calendarFragment
    }
  }
  ${calendarFragment}
`

const toStudent = (student: HasuraStudent): Student => {
  return {
    id: student?.id,
    name: `${student?.user.lastname?.toUpperCase()} ${student?.user.firstname}`,
    firstname: student?.user.firstname,
    lastname: student?.user.lastname?.toUpperCase(),
    email: student?.user.account?.email,
    pathways: toPathways(
      student?.student_pathways.map((student_pathway) => student_pathway.pathway)
    ),
    calendars: toCalendars(
      student?.student_calendars.map((student_calendar) => student_calendar.calendar)
    ),
    archived: student?.archived,
    events: student?.student_calendars[0]?.calendar?.module_calendars.flatMap(
      ({ module }: { module: HasuraModule }) =>
        module.module_lessons.map(({ lesson }: { lesson: HasuraLesson }) => toEvent(lesson, module))
    ),
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
      searchText: "%%",
      searchText2: "",
      condition: { archived: { _eq: false } },
    },
  })

  const { data, ...result } = useQuery(SEARCH_STUDENTS, searchQuery)

  const filterByPathway = (id?: string) => {
    setSearchQuery({
      variables: {
        ...searchQuery.variables,
        condition: {
          ...searchQuery.variables.condition,
          student_pathways: id ? { pathway: { id: { _eq: id } } } : undefined,
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
        ...searchQuery.variables,
        condition: {
          ...searchQuery.variables.condition,
          archived: { _eq: archived === null ? undefined : archived },
        },
      },
    })
  }

  const search = useDebouncedCallback((searchText: string) => {
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
