import { LoginPage } from '@planingo/ditto'
import { useLogin } from '../Tools/Account/login.hook.js'

export const Login = () => {
    const login = useLogin()

	const onSubmit = async (value: {email: string, password: string}) => {
		console.log(value)
		await (await login)(value)
	}
	
    return <LoginPage onSubmit={(value: {email: string, password: string}) => onSubmit(value)} />
}