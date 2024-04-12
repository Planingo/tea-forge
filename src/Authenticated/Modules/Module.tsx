import { Header, ModuleForm, UserOutlined } from "@pixel-brew/bubble-craft"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAddOneModule, useGetModuleById } from "../../Tools/Authenticated/modules.js"
import { useSearchPathways } from "../../Tools/Authenticated/pathways.js"
import { Details } from "../Layout/Details.js"
import { Layout } from "../Layout/Layout.js"

export const Module = () => {
  const { id } = useParams()
  const { module, loading: loadingModule } = useGetModuleById(id!)
  const navigate = useNavigate()
  const [addOneModule, loading] = useAddOneModule()
  const [isGrid, setIsGrid] = useState(false)
  const { pathways } = useSearchPathways()

  if (loadingModule) return

  return (
    <Layout>
      <Header
        placeholder="search"
        isRefinementList={false}
        refinementDetails={{
          FirstActionIcon: UserOutlined,
          firstActionText: "app.add.module",
          FirstForm: <ModuleForm onSubmit={addOneModule} pathways={pathways} />,
          firstActioning: loading,
          onFirstAction: addOneModule,
          isGrid: isGrid,
          setIsGrid: () => setIsGrid(!isGrid),
          formId: "module-form",
          backTo: () => navigate("/modules"),
          SecondActionIcon: UserOutlined,
          secondActionText: "app.edit.module",
          SecondForm: <></>,
          secondActioning: loading,
          onSecondAction: addOneModule,
          Info: (
            <div className="infos">
              <img src={module?.photo} alt={module?.alt} />
              <div className="info">
                <p>{module?.name?.toUpperCase()}</p>
              </div>
            </div>
          ),
        }}
      />
      <Details entityName={module?.name} events={module?.events} />
    </Layout>
  )
}
