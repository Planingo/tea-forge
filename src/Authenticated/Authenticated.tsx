import { Navigation, Roles } from "@pixel-brew/bubble-craft"
import { useContext } from "react"
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom"
import packageJson from "../../package.json"
import { AccountContexte, AuthentificationContexte } from "../App.js"
import { useGetAccountById } from "../Tools/Authenticated/account.js"
import "./authenticated.css"

export const Authenticated = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { token } = useContext(AuthentificationContexte)!
  const { account: accountId } = useContext(AccountContexte)!

  const { account } = useGetAccountById(accountId!)

  if (token && location.pathname === "/")
    return (
      <Navigation roles={[Roles.SUPER_ADMIN, Roles.PLANING_KEEPER]} email={account?.email}>
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
            localStorage.removeItem("account")
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
