import {
  Actions,
  ArchivedOutlined,
  CompanyForm,
  CompanyOutlined,
  Filters,
  Gallery,
  GalleryList,
  Header,
  Tooltip,
} from "@pixel-brew/bubble-craft"
import { useState } from "react"
import {
  useAddOneCompany,
  useArchivedById,
  useSearchCompanies,
} from "../../Tools/Authenticated/companies.js"
import { Actions as ActionsType } from "../../Types/actions.js"
import { Company } from "../../Types/company.js"
import { Layout } from "../Layout/Layout.js"

export const Companies = () => {
  const { companies, loading: loadingCompanies, onSearch, filterByArchived } = useSearchCompanies()
  const [addOneCompany, loading] = useAddOneCompany()
  const [isGrid, setIsGrid] = useState(false)
  const [archivedOneCompany] = useArchivedById()
  return (
    <Layout>
      <Header
        placeholder="search"
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
      />
      <Filters
        selects={[
          {
            placeholder: "archived",
            defaultValue: "non archivé",
            options: [
              { value: "all", label: "tous" },
              { value: true, label: "archivé" },
              { value: false, label: "non archivé" },
            ],
            allowClear: false,
            onChange: (isArchived: string | boolean) => filterByArchived(isArchived),
          },
        ]}
        count={{ id: "company", count: companies?.length }}
      />
      {isGrid ? (
        <Gallery datas={companies} loading={loadingCompanies} name="companies" />
      ) : (
        <GalleryList
          columns={[
            {
              key: "archived",
              width: "2em",
              render: (archived: boolean) => (
                <>
                  {archived ? (
                    <Tooltip title="archived" placement="bottom">
                      <ArchivedOutlined className="cloud" />
                    </Tooltip>
                  ) : (
                    <></>
                  )}
                </>
              ),
            },
            {
              key: "photo",
              width: "5em",
              haveLabel: true,
              render: (photo: string) => <img src={photo} alt="placeholder" />,
            },
            { key: "name", haveLabel: true },
            { key: "student_number", haveLabel: true },
            {
              key: "actions",
              title: "actions",
              width: "10em",
              haveLabel: true,
              render: (actions: ActionsType, record: Company) => (
                <Actions
                  to={`/companies/${record.id}`}
                  downloadTitle={actions.downloadTitle}
                  cloudTitle={actions.cloudTitle}
                  deleteTitle={actions.deleteTitle}
                  deleteOnClick={() => archivedOneCompany(record.id)}
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
