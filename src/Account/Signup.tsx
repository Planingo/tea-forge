import { SignupPage } from '@planingo/ditto'
import { useCreateAccount } from '../Tools/Account/signup.hook.js'

export const Signup = () => {
	const createAccount = useCreateAccount()

	const onSubmit = async (value: any) => {
		await (await createAccount)(value)
	}

    return <SignupPage onSubmit={onSubmit}/>
}
