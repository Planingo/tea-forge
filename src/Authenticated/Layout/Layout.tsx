import { ReactNode } from "react"
import "./layout.css"

export const Layout = ({ children }: { children: ReactNode }) => {
  return <div className="layout">{children}</div>
}
