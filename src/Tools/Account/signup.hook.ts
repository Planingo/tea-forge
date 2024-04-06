import { gql, useMutation } from "@apollo/client"
import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthentificationContexte } from "../../App.js"

export const useCreateAccount = async () => {
  const [doCreate] = useMutation(gql`
    mutation createAccount($email: String!, $password: String!) {
      account: createAccount(email: $email, password: $password) {
        id: accountId
        token
      }
    }
  `)
  const navigate = useNavigate()
  const { setToken } = useContext(AuthentificationContexte)!
  return async (values: any) => {
    const { data, errors } = await doCreate({ variables: values })
    if (errors) return
    if (data?.account.token) {
      setToken(data.account.token)
      navigate("/", { replace: true })
      return true
    }
  }
}
