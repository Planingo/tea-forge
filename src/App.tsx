import { IntlProvider, ThemeProvider } from '@planingo/ditto'
import './App.css'
import { BrowserRouter as Router, Route as ReactRoute, Routes as ReactRoutes } from 'react-router-dom'
import { Login } from './Account/Login.js'
import { Signup } from './Account/Signup.js'
import { Reset } from './Account/Reset.js'
import { ApolloProvider } from '@apollo/client'
import { mug } from './Tools/Database/graphql.js'
import { createContext } from 'react'
import { Authenticated } from './Authenticated/Authenticated.js'
import useLocalStorageState from 'use-local-storage-state'
import { Student } from './Authenticated/Students/Student.js'
import { Students } from './Authenticated/Students/Students.js'
import { Professors } from './Authenticated/Professors/Professors.js'
import { Calendars } from './Authenticated/Calendars/Calendars.js'
import { Lessons } from './Authenticated/Lessons/Lessons.js'
import { Modules } from './Authenticated/Modules/Modules.js'
import { Pathways } from './Authenticated/Pathways/Pathways.js'
import { Rooms } from './Authenticated/Rooms/Rooms.js'
import { Settings } from './Authenticated/Settings/Settings.js'
import { Companies } from './Authenticated/Companies/Companies.js'
import { Calendar } from './Authenticated/Calendars/Calendar.js'
import { Lesson } from './Authenticated/Lessons/Lesson.js'
import { Professor } from './Authenticated/Professors/Professor.js'

export const AuthentificationContexte = createContext<{token: string | undefined, setToken: (token: string | undefined) => void} | undefined>(undefined)

function App() {
  const [token, setToken] = useLocalStorageState<string | undefined>('token', undefined);
  return (
    <AuthentificationContexte.Provider value={{token, setToken}} >
      <ThemeProvider>
        <IntlProvider>
          <ApolloProvider client={mug}>
            <Routes/>
          </ApolloProvider>
        </IntlProvider>
      </ThemeProvider>
    </AuthentificationContexte.Provider>
  )
}


function Routes() {
	return (
		<Router>
      		<ReactRoutes>
				<ReactRoute path="/login" element={<Login />}/>
				<ReactRoute path="/signup" element={<Signup />}/>
				<ReactRoute path="/reset" element={<Reset />}/>
				<ReactRoute path="/" element={<Authenticated />}>
					<ReactRoute path="/students/:id" element={<Student />} />
					<ReactRoute path="/students/" element={<Students />} />
					<ReactRoute path="/professors/:id" element={<Professor />}/>
					<ReactRoute path="/professors/" element={<Professors />}/>
					<ReactRoute path="/calendars/:id" element={<Calendar />}/>
					<ReactRoute path="/calendars/" element={<Calendars />}/>
					<ReactRoute path="/lessons/:id" element={<Lesson />}/>
					<ReactRoute path="/lessons/" element={<Lessons />}/>
					<ReactRoute path="/modules/:id?" element={<Modules />}/>
					<ReactRoute path="/pathways/:id?" element={<Pathways />}/>
					<ReactRoute path="/rooms/:id?" element={<Rooms />}/>
					<ReactRoute path="/companies/:id?" element={<Companies />}/>
					<ReactRoute path="/settings" element={<Settings />}/>
				</ReactRoute>
			</ReactRoutes>
		</Router>
	)
}

export default App
