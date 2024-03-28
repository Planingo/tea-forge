import { ApolloClient, createHttpLink, InMemoryCache  } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'


// const adminSecret: string = process.env.REACT_APP_AUTH_ADMIN_SECRET || ""

const adminSecret = ""

const headers: Record<string, string> = {
	'x-hasura-role': 'admin'
}

if(adminSecret)
    headers['x-hasura-admin-secret'] = "adminSecret"

const httpLink = createHttpLink({
	uri: 'http://localhost:8080/v1/graphql',
	headers,
});

const authLink = setContext((_, { headers }): any => {
	const token = localStorage.getItem('token')
	if(!token) return
	return { headers: {
		...headers,
		authorization: `Bearer ${JSON.parse(token)}`,
	}}
})

export const mug = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache()
})