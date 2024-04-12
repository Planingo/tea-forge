import { Navigation, Roles } from "@pixel-brew/bubble-craft"
import { useContext } from "react"
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom"
import packageJson from "../../package.json"
import { AuthentificationContexte } from "../App.js"
import "./authenticated.css"

export const Authenticated = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { token } = useContext(AuthentificationContexte)!

  if (token && location.pathname === "/")
    return (
      <Navigation roles={[Roles.SUPER_ADMIN, Roles.PLANING_KEEPER]}>
        <Navigate to="/calendars" replace={true} />
        <Outlet />
      </Navigation>
    )

  if (token)
    return (
      <div className="authentificated">
        <Navigation
          roles={[Roles.SUPER_ADMIN, Roles.PLANING_KEEPER]}
          logout={() => {
            localStorage.removeItem("token")
            navigate("/login")
          }}
        />
        <div className="right">
          <Outlet />
          <div className="footer">
            <p>Tea forge - version {packageJson.version}</p>
          </div>
        </div>
      </div>
    )

  return <Navigate to="/login" />
}
