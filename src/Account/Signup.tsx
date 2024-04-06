import { SignupPage } from "@pixel-brew/bubble-craft"
import { useCreateAccount } from "../Tools/Account/signup.hook.js"

export const Signup = () => {
  const createAccount = useCreateAccount()

  const onSubmit = async (value: { email: string; password: string }) => {
    await (
      await createAccount
    )(value)
  }

  return <SignupPage onSubmit={onSubmit} />
}
