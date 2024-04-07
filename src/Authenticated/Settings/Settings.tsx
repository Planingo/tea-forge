import { Tabs } from "@pixel-brew/bubble-craft"
import { useContext } from "react"
import { AccountContexte } from "../../App.js"
import { useGetAccountById } from "../../Tools/Authenticated/account.js"
import { Horaire } from "./Horaire.js"
import "./settings.css"

export const Settings = () => {
  const { account: accountId } = useContext(AccountContexte)!

  const { account } = useGetAccountById(accountId!)

  return (
    <div className="settings">
      <Tabs
        defaultActiveKey="2"
        items={[
          { key: "1", label: account.name },
          { key: "2", label: "Horaire", children: <Horaire week={account?.week[0]} /> },
        ]}
      />
    </div>
  )
}
