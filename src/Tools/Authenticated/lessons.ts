import { gql, useMutation, useQuery } from "@apollo/client";
import { Lesson } from "../../Types/lesson.js";

const getLessonsQuerie = gql`
    query lessons {
        lesson(order_by: {name: asc}, where: {archived: {_eq: false}}) {
            end_date
            id
            module {
              id
              name
            }
            name
            start_date
          }
    }
`

export const useLessons = () => {
	const {data, ...result} = useQuery(getLessonsQuerie)
    const lessons = data?.lesson.map((lesson: Lesson) => ({
        id: lesson.id,
        name: `${lesson.name.toUpperCase()}`,
        start_date: lesson.start_date,
        end_date: lesson.end_date,
        module: lesson.module.name,
        tags: [],
        actions: {
            downloadTitle: `Télécharger le calendrier pour ${lesson.name.toUpperCase()}`,
            cloudTitle: `Envoyer le calendrier à ${lesson.name.toUpperCase()}`,
            deleteTitle: `Supprimer l'étudtiant ${lesson.name.toUpperCase()}`,
        },
        link: `/lessons/${lesson.id}`,
        alt: `${lesson.name.toUpperCase()}`,
        src: `https://avatars.bugsyaya.dev/150/${lesson.id}`,
    }))
    return {lessons, ...result}
}

export const useAddOneLesson = () => {
    const [addOneLesson, result] = useMutation(gql`
        mutation addOneLesson($name: String, $start_date: timestamptz, $end_date: timestamptz, $module_id: uuid) {
            insert_lesson_one(object: {name: $name, start_date: $start_date, end_date: $end_date, module_id: $module_id}) {
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

	return [(lesson: Lesson) => {
        return (addOneLesson({ variables: lesson }))}, result]
}
