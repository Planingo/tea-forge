import { gql, useQuery, useMutation } from '@apollo/client';
import { Student } from '../../Types/student.js';

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
        }
    }
`

export const useStudents = () => {
	const {data, ...result} = useQuery(getStudentsQuerie)
    
    const students = data?.student.map((student: Student) => ({
        id: student.user.id,
        name: `${student.user.lastname?.toUpperCase()} ${student.user.firstname}`,
        firstname: student.user.firstname,
        lastname: student.user.lastname?.toUpperCase(),
        email: student.user.account?.email,
        tags: [],
        actions : {
            downloadTitle: `Télécharger le calendrier pour ${student.user.lastname?.toUpperCase()} ${student.user.firstname}`,
            cloudTitle: `Envoyer le calendrier à ${student.user.lastname?.toUpperCase()} ${student.user.firstname}`,
            deleteTitle: `Supprimer l'étudtiant ${student.user.lastname?.toUpperCase()} ${student.user.firstname}`,
        },
        link: `/students/${student.user.id}`,
        alt: `${student.user.lastname?.toUpperCase()} ${student.user.firstname}`,
        src: `https://avatars.bugsyaya.dev/150/${student.user.id}`,
    }))
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

	return [(student: Student) => {
        return (addOneStudent({ variables: student }))}, result]
}
