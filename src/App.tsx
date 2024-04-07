import { ApolloProvider } from "@apollo/client"
import { IntlProvider, ThemeProvider } from "@pixel-brew/bubble-craft"
import { createContext, useEffect } from "react"
import {
  Route as ReactRoute,
  Routes as ReactRoutes,
  BrowserRouter as Router,
  useLocation,
} from "react-router-dom"
import useLocalStorageState from "use-local-storage-state"
import { Login } from "./Account/Login.js"
import { Reset } from "./Account/Reset.js"
import { Signup } from "./Account/Signup.js"
import "./App.css"
import { Authenticated } from "./Authenticated/Authenticated.js"
import { Calendar } from "./Authenticated/Calendars/Calendar.js"
import { Calendars } from "./Authenticated/Calendars/Calendars.js"
import { Companies } from "./Authenticated/Companies/Companies.js"
import { Company } from "./Authenticated/Companies/Company.js"
import { Lesson } from "./Authenticated/Lessons/Lesson.js"
import { Lessons } from "./Authenticated/Lessons/Lessons.js"
import { Module } from "./Authenticated/Modules/Module.js"
import { Modules } from "./Authenticated/Modules/Modules.js"
import { Pathway } from "./Authenticated/Pathways/Pathway.js"
import { Pathways } from "./Authenticated/Pathways/Pathways.js"
import { Professor } from "./Authenticated/Professors/Professor.js"
import { Professors } from "./Authenticated/Professors/Professors.js"
import { Room } from "./Authenticated/Rooms/Room.js"
import { Rooms } from "./Authenticated/Rooms/Rooms.js"
import { Settings } from "./Authenticated/Settings/Settings.js"
import { Student } from "./Authenticated/Students/Student.js"
import { Students } from "./Authenticated/Students/Students.js"
import { mug } from "./Tools/Database/graphql.js"

export const AuthentificationContexte = createContext<
  | {
      token: string | undefined
      setToken: (token: string | undefined) => void
    }
  | undefined
>(undefined)

const titles: Record<string, string> = {
  "/students": "Tea Forge - Students",
  "/professors": "Tea Forge - Professors",
  "/calendars": "Tea Forge - Calendars",
  "/lessons": "Tea Forge - Lessons",
  "/modules": "Tea Forge - Modules",
  "/rooms": "Tea Forge - Rooms",
  "/companies": "Tea Forge - Companies",
  "/settings": "Tea Forge - Settings",
}
export const AccountContexte = createContext<
  | {
      account: string | undefined
      setAccount: (account: string | undefined) => void
    }
  | undefined
>(undefined)

function App() {
  const [token, setToken] = useLocalStorageState<string | undefined>("token", undefined)
  const [account, setAccount] = useLocalStorageState<string | undefined>("account", undefined)
  return (
    <AuthentificationContexte.Provider value={{ token, setToken }}>
      <AccountContexte.Provider value={{ account, setAccount }}>
        <ThemeProvider>
          <IntlProvider>
            <ApolloProvider client={mug}>
              <Routes />
            </ApolloProvider>
          </IntlProvider>
        </ThemeProvider>
      </AccountContexte.Provider>
    </AuthentificationContexte.Provider>
  )
}

function Routes() {
  return (
    <Router>
      <SyncTitle />
      <ReactRoutes>
        <ReactRoute path="/login" element={<Login />} />
        <ReactRoute path="/signup" element={<Signup />} />
        <ReactRoute path="/reset" element={<Reset />} />
        <ReactRoute path="/" element={<Authenticated />}>
          <ReactRoute path="/students/:id" element={<Student />} />
          <ReactRoute path="/students/" element={<Students />} />
          <ReactRoute path="/professors/:id" element={<Professor />} />
          <ReactRoute path="/professors/" element={<Professors />} />
          <ReactRoute path="/calendars/:id" element={<Calendar />} />
          <ReactRoute path="/calendars/" element={<Calendars />} />
          <ReactRoute path="/lessons/:id" element={<Lesson />} />
          <ReactRoute path="/lessons/" element={<Lessons />} />
          <ReactRoute path="/modules/:id" element={<Module />} />
          <ReactRoute path="/modules/" element={<Modules />} />
          <ReactRoute path="/pathways/:id" element={<Pathway />} />
          <ReactRoute path="/pathways/" element={<Pathways />} />
          <ReactRoute path="/rooms/:id" element={<Room />} />
          <ReactRoute path="/rooms/" element={<Rooms />} />
          <ReactRoute path="/companies/:id" element={<Company />} />
          <ReactRoute path="/companies/" element={<Companies />} />
          <ReactRoute path="/settings" element={<Settings />} />
        </ReactRoute>
      </ReactRoutes>
    </Router>
  )
}

function SyncTitle() {
  const location = useLocation()
  useEffect(() => {
    document.title = titles[location.pathname] || "Tea Forge"
  }, [location])
  return null
}

export default App
