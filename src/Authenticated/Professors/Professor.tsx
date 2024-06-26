import { Header, ProfessorForm, UserOutlined } from "@pixel-brew/bubble-craft"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAddOneProfessor, useGetProfessorById } from "../../Tools/Authenticated/professors.js"
import { Details } from "../Layout/Details.js"
import { Layout } from "../Layout/Layout.js"

export const Professor = () => {
  const { id } = useParams()
  const { professor, loading: loadingProfessor } = useGetProfessorById(id!)
  const navigate = useNavigate()
  const [addOneProfessor, loading] = useAddOneProfessor()
  const [isGrid, setIsGrid] = useState(false)

  if (loadingProfessor) return

  return (
    <Layout>
      <Header
        placeholder="Rechercher"
        isRefinementList={false}
        refinementDetails={{
          FirstActionIcon: UserOutlined,
          firstActionText: "app.add.professor",
          FirstForm: <ProfessorForm onSubmit={addOneProfessor} />,
          firstActioning: loading,
          onFirstAction: addOneProfessor,
          isGrid: isGrid,
          setIsGrid: () => setIsGrid(!isGrid),
          formId: "professor-form",
          backTo: () => navigate("/professors"),
          SecondActionIcon: UserOutlined,
          secondActionText: "app.edit.professor",
          SecondForm: <ProfessorForm onSubmit={addOneProfessor} />,
          secondActioning: loading,
          onSecondAction: addOneProfessor,
          Info: (
            <div className="infos">
              <img src={professor?.photo} alt={professor?.alt} />
              <div className="info">
                <p>
                  {professor?.lastname.toUpperCase()} {professor?.firstname}
                </p>
                <p>{professor?.email}</p>
              </div>
            </div>
          ),
        }}
      />
      <Details entityName={professor?.name} events={[]} />
    </Layout>
  )
}
