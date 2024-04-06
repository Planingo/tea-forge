import {
  Actions,
  CompanyForm,
  CompanyOutlined,
  Gallery,
  GalleryList,
  Header,
  Spin,
} from "@planingo/ditto"
import { useState } from "react"
import { useAddOneCompany, useCompanies } from "../../Tools/Authenticated/companies.js"
import { Actions as ActionsType } from "../../Types/actions.js"
import { Company } from "../../Types/company.js"
import { Layout } from "../Layout/Layout.js"

export const Companies = () => {
  const onSearch = (e: string) => {
    console.log
  }
  const { companies, loading: loadingCompanies } = useCompanies()
  const [addOneCompany, loading] = useAddOneCompany()
  const [isGrid, setIsGrid] = useState(false)
  return (
    <Layout>
      <Header
        placeholder="Rechercher"
        onSearch={onSearch}
        isRefinementList={true}
        refinementList={{
          FirstActionIcon: CompanyOutlined,
          firstActionText: "app.add.company",
          FirstForm: <CompanyForm onSubmit={addOneCompany} />,
          firstActioning: loading,
          onFirstAction: addOneCompany,
          isGrid: isGrid,
          setIsGrid: () => setIsGrid(!isGrid),
          formId: "company-form",
        }}
        refinementDetails={{
          FirstActionIcon: CompanyOutlined,
          firstActionText: "app.add.company",
          FirstForm: <CompanyForm onSubmit={addOneCompany} />,
          firstActioning: loading,
          onFirstAction: addOneCompany,
          isGrid: isGrid,
          setIsGrid: () => setIsGrid(isGrid),
          formId: "company-form",
          SecondActionIcon: console.log,
          SecondForm: <></>,
          onSecondAction: console.log,
          secondActionText: "app.edit.company",
          secondActioning: console.log,
        }}
      />
      {loadingCompanies ? (
        <Spin />
      ) : isGrid ? (
        <Gallery datas={companies} name="companies" />
      ) : (
        <GalleryList
          columns={[
            {
              key: "photo",
              render: (photo: string) => <img src={photo} alt="placeholder" />,
            },
            { key: "name" },
            {
              key: "actions",
              title: "actions",
              render: (actions: ActionsType, record: Company) => (
                <Actions
                  to={`/companies/${record.id}`}
                  downloadTitle={actions.downloadTitle}
                  cloudTitle={actions.cloudTitle}
                  deleteTitle={actions.deleteTitle}
                />
              ),
            },
          ]}
          datas={companies}
          name="companies"
        />
      )}
    </Layout>
  )
}
