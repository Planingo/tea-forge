import { CompanyForm, Header, UserOutlined } from "@pixel-brew/bubble-craft"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAddOneCompany, useGetCompanyById } from "../../Tools/Authenticated/companies.js"
import { Details } from "../Layout/Details.js"
import { Layout } from "../Layout/Layout.js"

export const Company = () => {
  const { id } = useParams()
  const { company, loading: loadingCompany } = useGetCompanyById(id!)
  const navigate = useNavigate()
  const [addOneCompany, loading] = useAddOneCompany()
  const [isGrid, setIsGrid] = useState(false)

  if (loadingCompany) return

  return (
    <Layout>
      <Header
        placeholder="search"
        isRefinementList={false}
        refinementDetails={{
          FirstActionIcon: UserOutlined,
          firstActionText: "app.add.company",
          FirstForm: <CompanyForm onSubmit={addOneCompany} />,
          firstActioning: loading,
          onFirstAction: addOneCompany,
          isGrid: isGrid,
          setIsGrid: () => setIsGrid(!isGrid),
          formId: "company-form",
          backTo: () => navigate("/companies"),
          SecondActionIcon: UserOutlined,
          secondActionText: "app.edit.company",
          SecondForm: <></>,
          secondActioning: loading,
          onSecondAction: addOneCompany,
          Info: (
            <div className="infos">
              <img src={company?.photo} alt={company?.alt} />
              <div className="info">
                <p>{company?.name?.toUpperCase()}</p>
              </div>
            </div>
          ),
        }}
      />
      <Details entityName={company?.name} events={company?.events} />
    </Layout>
  )
}
