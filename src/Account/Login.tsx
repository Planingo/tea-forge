import { LoginPage } from "@pixel-brew/bubble-craft"
import { useLogin } from "../Tools/Account/login.hook.js"

export const Login = () => {
  const login = useLogin()

  const onSubmit = async (value: { email: string; password: string }) => {
    await (
      await login
    )(value)
  }
  return <LoginPage onSubmit={(value: { email: string; password: string }) => onSubmit(value)} />
}
