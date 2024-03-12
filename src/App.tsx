import { IntlProvider, ThemeProvider } from '@planingo/ditto'
import './App.css'
import { BrowserRouter as Router, Route as ReactRoute, Routes as ReactRoutes } from 'react-router-dom'
import { Login } from './Account/Login.js'
import { Signup } from './Account/Signup.js'
import { Reset } from './Account/Reset.js'

function App() {
  return (
    <ThemeProvider>
      <IntlProvider>
        <Routes />
      </IntlProvider>
    </ThemeProvider>
  )
}


function Routes() {
	return (
		<Router>
      <ReactRoutes>
				<ReactRoute path="/" element={<Login />}/>
				<ReactRoute path="/signup" element={<Signup />}/>
				<ReactRoute path="/reset" element={<Reset />}/>
      </ReactRoutes>
		</Router>
	)
}

export default App
