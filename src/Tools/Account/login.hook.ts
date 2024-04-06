import { gql, useLazyQuery } from "@apollo/client"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthentificationContexte } from "../../App.js"

export const useLogin = async () => {
  const [doLogin] = useLazyQuery(gql`
    query ($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
        accountId
      }
    }
  `)
  const navigate = useNavigate()
  const { setToken } = useContext(AuthentificationContexte)!
  return async (values: any) => {
    const { data, error, loading } = await doLogin({ variables: values })
    if (error) return
    if (data.login.token) {
      setToken(data.login.token)
      navigate("/", { replace: true })
      return { data, loading }
    }
  }
}
