import { gql, useMutation, useQuery } from "@apollo/client";
import { Lesson as HasuraLesson } from "../../Types/Hasura/lesson.js";
import { generateColor } from "../../../helper/generate_colors.js";
import { Lesson } from "../../Types/lesson.js";

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

const getLessonsQuerie = gql`
    query lessons {
        lesson(order_by: {name: asc}, where: {archived: {_eq: false}}) {
            end_date
            start_date
            id
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


const toLesson = (lesson: HasuraLesson | undefined | null): Lesson | null => {
    if(!lesson) return null

    const start = new Date(lesson.start_date);
    const end = new Date(lesson.end_date);
    return {
        id: lesson.id,
        name: `${lesson.name.toUpperCase()}`,
        start_date: `${(start).toLocaleTimeString()} ${(start).toLocaleDateString()}`,
        end_date: `${(end).toLocaleTimeString()} ${(end).toLocaleDateString()}`,
        module: lesson.module_lessons[0].module,
        pathway: lesson.module_lessons[0].module?.pathway_modules[0]?.pathway,
        events: ([{
                title: lesson.name,
                start: lesson.start_date,
                end: lesson.start_date,
                backgroundColor: generateColor(lesson.module_lessons[0].module.name),
                borderColor: generateColor(lesson.module_lessons[0].module.name),
            }]
        ),
        tags: [],
        actions: {
            downloadTitle: `Télécharger le calendrier pour ${lesson.name.toUpperCase()}`,
            cloudTitle: `Envoyer le calendrier à ${lesson.name.toUpperCase()}`,
            deleteTitle: `Supprimer l'étudtiant ${lesson.name.toUpperCase()}`,
        },
        link: `/lessons/${lesson.id}`,
        alt: `${lesson.name.toUpperCase()}`,
        src: `https://avatars.bugsyaya.dev/150/${lesson.id}`,
    }
}

export const useGetLessonById = (id: string) => {
    const {data, ...result} = useQuery(getLessonById, { variables: { id: id } })

    const l = toLesson(data?.lesson_by_pk)
    console.log(l)
	return { lesson: l, ...result }
}

export const useLessons = () => {
	const {data, ...result} = useQuery(getLessonsQuerie)
    const lessons = data?.lesson.map((lesson: HasuraLesson) => toLesson(lesson))
    return {lessons, ...result}
}

export const useAddOneLesson = () => {
    const [addOneLesson, result] = useMutation(gql`
        mutation addOneLesson($name: String, $start_date: timestamptz, $end_date: timestamptz, $module_id: uuid) {
            insert_lesson_one(object: {name: $name, start_date: $start_date, end_date: $end_date, module_lessons: {data: {module_id: $module_id}}}) {
                id
            }
        }
    `,
    {
        refetchQueries: [
            {
                query: getLessonsQuerie,
            },
        ],
    },
    )

	return [(lesson: HasuraLesson) => {
        return (addOneLesson({ variables: lesson }))}, result]
}
