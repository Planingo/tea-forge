import { gql, useQuery, useMutation } from '@apollo/client';
import { Student as HasuraStudent } from '../../Types/Hasura/student.js';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce'
import { Lesson as HasuraLesson } from '../../Types/Hasura/lesson.js';
import { Module as HasuraModule } from '../../Types/Hasura/module.js';
import { generateColor } from '../../../helper/generate_colors.js';
import { Student } from '../../Types/student.js';

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
  query getAllStudents($searchText: String, $searchText2: String) {
    student(order_by: {user: {lastname: asc}}, 
        where: {
          user: {
            _or: [
              {firstname: {_ilike: $searchText}},
              {lastname: {_ilike: $searchText2}},
              {firstname: {_ilike: $searchText2}},
              {lastname: {_ilike: $searchText}}
            ]
          }
        }
    ) {
        id
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
        ...calendarFragment
    }
  }
  ${calendarFragment}
`

const getStudentsQuerie = gql`
    query students {
        student(order_by: {user: {lastname: asc}}, where: {archived: {_eq: false}, user: {archived: {_eq: false}}}) {
            id
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
            ...calendarFragment
        }
    }
    ${calendarFragment}
`

const getStudentById = gql`
    query student_by_pk($id: uuid!) {
        student_by_pk(id: $id) {
            id
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
        pathway: student?.student_pathways[0]?.pathway,
        calendar: student?.student_calendars[0]?.calendar,
        events: student?.student_calendars[0]?.calendar?.module_calendars.flatMap(({module}: ({module: HasuraModule})) =>
            module.module_lessons.map(({lesson}: ({lesson: HasuraLesson})) =>
                ({
                    title: lesson.name,
                    start: lesson.start_date,
                    end: lesson.end_date,
                    backgroundColor: generateColor(module.name),
                    borderColor: generateColor(module.name),
                })
            )
        ),
        tags: [],
        actions : {
            downloadTitle: `Télécharger le calendrier pour ${student?.user.lastname?.toUpperCase()} ${student?.user.firstname}`,
            cloudTitle: `Envoyer le calendrier à ${student?.user.lastname?.toUpperCase()} ${student?.user.firstname}`,
            deleteTitle: `Supprimer l'étudtiant ${student?.user.lastname?.toUpperCase()} ${student?.user.firstname}`,
        },
        link: `/students/${student?.user.id}`,
        alt: `${student?.user.lastname?.toUpperCase()} ${student?.user.firstname}`,
        photo: `https://avatars.bugsyaya.dev/150/${student?.user.id}`,
    }
}

const toStudents = (students : HasuraStudent[]): Student[] => {
    return students?.map((student: HasuraStudent) => toStudent(student))
}

export const useStudents = () => {
	const {data, ...result} = useQuery(getStudentsQuerie)
    
    const students = toStudents(data?.student)
    return {students, ...result}
}

export const useAddOneStudent = () => {
    const [addOneStudent, result] = useMutation(gql`
        mutation addOneStudent($firstname: String, $lastname: String, $email: String) {
            insert_student_one(object: {user: {data: {firstname: $firstname, lastname: $lastname, account: {data: {email: $email}}}}}) {
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
        refetchQueries: [
            {
                query: getStudentsQuerie,
            },
        ],
    },
    )

	return [(student: HasuraStudent) => {
        return (addOneStudent({ variables: student }))}, result]
}

export const useSearchStudents = () => {
	const [searchQuery, setSearchQuery] = useState({variables: { searchText:"%%", searchText2:"" }})

    const {data,...result } = useQuery(SEARCH_STUDENTS, searchQuery)
  
    const search = useDebouncedCallback((searchText: string) => {
		const searchsTmp = searchText.split(" ").map((st: string) => `%${st}%`)
		if (searchText) setSearchQuery({variables: {  searchText: searchsTmp[0], searchText2: searchsTmp[1] || "" }})
		else setSearchQuery({variables: { searchText:"%%", searchText2:"" }})
    }, 500)

    const students = toStudents(data?.student)
    return { search, students, ...result }
}

export const useGetStudentById = (id: string) => {
    const {data, ...result} = useQuery(getStudentById, { variables: { id: id } })

    const s = toStudent(data?.student_by_pk)
	return { student: s, ...result }
}

export const useCountStudent = () => {
    const {data, ...result} = useQuery(gql`
        query count {
            student_aggregate {
                aggregate {
                    count
                }
            }
        }
    `)

    return {count: data?.student_aggregate.aggregate.count, ...result }
}
