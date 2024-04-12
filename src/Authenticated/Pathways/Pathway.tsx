import { Header, PathwayForm, UserOutlined } from "@pixel-brew/bubble-craft"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  useAddOnePathway,
  useGetPathwayById,
  useSearchPathways,
} from "../../Tools/Authenticated/pathways.js"
import { Details } from "../Layout/Details.js"
import { Layout } from "../Layout/Layout.js"

export const Pathway = () => {
  const { id } = useParams()
  const { pathway, loading: loadingPathway } = useGetPathwayById(id!)
  const navigate = useNavigate()
  const [addOnePathway, loading] = useAddOnePathway()
  const [isGrid, setIsGrid] = useState(false)
  const { pathways } = useSearchPathways()

  if (loadingPathway) return

  return (
    <Layout>
      <Header
        placeholder="search"
        isRefinementList={false}
        refinementDetails={{
          FirstActionIcon: UserOutlined,
          firstActionText: "app.add.pathway",
          FirstForm: <PathwayForm onSubmit={addOnePathway} pathways={pathways} />,
          firstActioning: loading,
          onFirstAction: addOnePathway,
          isGrid: isGrid,
          setIsGrid: () => setIsGrid(!isGrid),
          formId: "pathway-form",
          backTo: () => navigate("/pathways"),
          SecondActionIcon: UserOutlined,
          secondActionText: "app.edit.pathway",
          SecondForm: <></>,
          secondActioning: loading,
          onSecondAction: addOnePathway,
          Info: (
            <div className="infos">
              <img src={pathway?.photo} alt={pathway?.alt} />
              <div className="info">
                <p>{pathway?.name?.toUpperCase()}</p>
              </div>
            </div>
          ),
        }}
      />
      <Details entityName={pathway?.name} events={pathway?.events} />
    </Layout>
  )
}
