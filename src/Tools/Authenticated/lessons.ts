import { gql, useMutation, useQuery } from "@apollo/client"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { generateColor } from "../../../helper/generate_colors.js"
import { Lesson as HasuraLesson } from "../../Types/Hasura/lesson.js"
import { Lesson } from "../../Types/lesson.js"
import { toModules } from "./modules.js"
import { toPathways } from "./pathways.js"

const calendarFragment = gql`
  fragment calendarFragment on lesson {
    calendar_lessons {
      id
      lesson {
        id
        end_date
        name
      }
    }
  }
`

const SEARCH_LESSONS = gql`
  query getAllLessons($condition: lesson_bool_exp!) {
    lesson(where: { _and: [$condition] }, order_by: { name: asc }) {
      end_date
      start_date
      id
      archived
      name
      module_lessons {
        id
        module {
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
      ...calendarFragment
    }
  }
  ${calendarFragment}
`

const getLessonById = gql`
  query lesson_by_pk($id: uuid!) {
    lesson_by_pk(id: $id) {
      end_date
      id
      name
      start_date
      module_lessons {
        id
        module {
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
      ...calendarFragment
    }
  }
  ${calendarFragment}
`

const toLesson = (lesson: HasuraLesson): Lesson => {
  const start = new Date(lesson?.start_date)
  const end = new Date(lesson?.end_date)
  return {
    id: lesson?.id,
    name: `${lesson?.name.toUpperCase()}`,
    start_date: `${start.toLocaleTimeString()} ${start.toLocaleDateString()}`,
    end_date: `${end.toLocaleTimeString()} ${end.toLocaleDateString()}`,
    modules: toModules(lesson?.module_lessons?.map((module_lesson) => module_lesson.module)),
    archived: lesson?.archived,
    pathways: toPathways(
      lesson?.module_lessons.flatMap((module_lesson) =>
        module_lesson.module?.pathway_modules.map((pathway_modules) => pathway_modules.pathway)
      )
    ),
    events: [
      {
        title: lesson?.name,
        start: lesson?.start_date,
        end: lesson?.start_date,
        backgroundColor: generateColor(lesson?.module_lessons[0]?.module?.name || "null"),
        borderColor: generateColor(lesson?.module_lessons[0]?.module?.name || "null"),
      },
    ],
    tags: [],
    actions: {
      downloadTitle: {
        id: "download.calendar.lesson",
        values: `${lesson?.name.toUpperCase()}`,
      },
      cloudTitle: {
        id: "send.calendar.lesson",
        values: `${lesson?.name.toUpperCase()}`,
      },
      deleteTitle: {
        id: "archived.lesson",
        values: `${lesson?.name.toUpperCase()}`,
      },
    },
    link: `/lessons/${lesson?.id}`,
    alt: `${lesson?.name.toUpperCase()}`,
    photo: `https://avatars.bugsyaya.dev/150/${lesson?.id}`,
  }
}

export const toLessons = (lessons: HasuraLesson[]): Lesson[] => {
  return lessons?.map((lesson: HasuraLesson) => toLesson(lesson))
}

export const useSearchLessons = () => {
  const [searchQuery, setSearchQuery] = useState<any>({
    variables: {
      condition: { archived: { _eq: false } },
    },
  })

  const { data, ...result } = useQuery(SEARCH_LESSONS, searchQuery)

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
          module_lessons: id
            ? { module: { pathway_modules: { pathway: { id: { _eq: id } } } } }
            : undefined,
        },
      },
    })
  }

  const filterByModule = (id?: string) => {
    setSearchQuery({
      variables: {
        ...searchQuery.variables,
        condition: {
          ...searchQuery.variables.condition,
          module_lessons: id ? { module: { id: { _eq: id } } } : undefined,
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

  const lessons = toLessons(data?.lesson)?.filter((lesson) =>
    searchQuery?.variables?.condition?.archived?._eq !== undefined
      ? lesson?.archived === searchQuery?.variables?.condition?.archived?._eq
      : lesson
  )

  return {
    onSearch,
    lessons,
    filterByArchived,
    filterByPathway,
    filterByModule,
    ...result,
  }
}

export const useGetLessonById = (id: string) => {
  const { data, ...result } = useQuery(getLessonById, {
    variables: { id: id },
  })

  const l = toLesson(data?.lesson_by_pk)
  return { lesson: l, ...result }
}

export const useAddOneLesson = () => {
  const [addOneLesson, result] = useMutation(
    gql`
      mutation addOneLesson(
        $name: String
        $start_date: timestamptz
        $end_date: timestamptz
        $module_id: uuid
      ) {
        insert_lesson_one(
          object: {
            name: $name
            start_date: $start_date
            end_date: $end_date
            module_lessons: { data: { module_id: $module_id } }
          }
        ) {
          id
        }
      }
    `,
    {
      refetchQueries: ["getAllLessons"],
    }
  )

  return [
    (lesson: HasuraLesson) => {
      return addOneLesson({ variables: lesson })
    },
    result,
  ]
}

export const useArchivedById = () => {
  const [archivedOneLesson, result] = useMutation(
    gql`
      mutation archivedOneLesson($id: uuid!) {
        update_lesson_by_pk(pk_columns: { id: $id }, _set: { archived: true }) {
          end_date
          start_date
          id
          archived
          name
        }
      }
    `,
    {
      refetchQueries: ["getAllLessons"],
    }
  )

  return [
    (id: string) => {
      return archivedOneLesson({ variables: { id: id } })
    },
    result,
  ] as const
}
