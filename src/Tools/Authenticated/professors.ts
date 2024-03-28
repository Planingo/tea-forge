import { gql, useMutation, useQuery } from "@apollo/client";
import { Professor } from '../../Types/professor.js';

const getProfessorsQuerie = gql`
    query professors {
        professor(order_by: {user: {lastname: asc}}, where: {archived: {_eq: false}, user: {archived: {_eq: false}}}) {
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

export const useProfessors = () => {
	const {data, ...result} =useQuery(getProfessorsQuerie)
    
    const professors = data?.professor.map((professor: Professor) => ({
        id: professor.user.id,
        name: `${professor.user.lastname?.toUpperCase()} ${professor.user.firstname}`,
        firstname: professor.user.firstname,
        lastname: professor.user.lastname?.toUpperCase(),
        email: professor.user.account?.email,
        tags: [],
        actions : {
            downloadTitle: `Télécharger le calendrier pour ${professor.user.lastname?.toUpperCase()} ${professor.user.firstname}`,
            cloudTitle: `Envoyer le calendrier à ${professor.user.lastname?.toUpperCase()} ${professor.user.firstname}`,
            deleteTitle: `Supprimer l'étudtiant ${professor.user.lastname?.toUpperCase()} ${professor.user.firstname}`,
        },
        link: `/professors/${professor.user.id}`,
        alt: `${professor.user.lastname?.toUpperCase()} ${professor.user.firstname}`,
        src: `https://avatars.bugsyaya.dev/150/${professor.user.id}`,
    }))
    return {professors, ...result}
}

export const useAddOneProfessor = () => {
    const [addOneProfessor, result] = useMutation(gql`
        mutation addOneProfessor($firstname: String, $lastname: String, $email: String) {
            insert_professor_one(object: {user: {data: {firstname: $firstname, lastname: $lastname, account: {data: {email: $email}}}}}) {
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
                query: getProfessorsQuerie,
            },
        ],
    },
    )

	return [(professor: Professor) => {
        return (addOneProfessor({ variables: professor }))}, result]
}
