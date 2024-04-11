import {
  Actions,
  ArchivedOutlined,
  Filters,
  Gallery,
  GalleryList,
  Header,
  ProfessorForm,
  TeamOutlined,
  Tooltip,
} from "@pixel-brew/bubble-craft"
import { useState } from "react"
import {
  useAddOneProfessor,
  useArchivedById,
  useSearchProfessors,
} from "../../Tools/Authenticated/professors.js"
import { Actions as ActionsType } from "../../Types/actions.js"
import { Professor } from "../../Types/professor.js"
import { Layout } from "../Layout/Layout.js"

export const Professors = () => {
  const {
    onSearch,
    professors,
    loading: loadingProfessors,
    filterByArchived,
  } = useSearchProfessors()
  const [addOneProfessor, loading] = useAddOneProfessor()
  const [archivedOneProfessor] = useArchivedById()
  const [isGrid, setIsGrid] = useState(false)
  return (
    <Layout>
      <Header
        placeholder="search"
        onSearch={onSearch}
        isRefinementList={true}
        refinementList={{
          FirstActionIcon: TeamOutlined,
          firstActionNotifText: "success.professor.add",
          firstActionText: "app.add.professor",
          FirstForm: <ProfessorForm onSubmit={addOneProfessor} />,
          firstActioning: loading,
          onFirstAction: addOneProfessor,
          isGrid: isGrid,
          setIsGrid: () => setIsGrid(!isGrid),
          formId: "professor-form",
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
        count={{ id: "professor", count: professors?.length }}
      />
      {isGrid ? (
        <Gallery datas={professors} loading={loadingProfessors} name="professors" />
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
            {
              key: "lastname",
              haveLabel: true,
              sorter: (a: Professor, b: Professor) => a.lastname.localeCompare(b.lastname),
            },
            {
              key: "firstname",
              haveLabel: true,
              sorter: (a: Professor, b: Professor) => a.firstname.localeCompare(b.firstname),
            },
            { key: "email", haveLabel: true },
            {
              key: "actions",
              width: "10em",
              haveLabel: true,
              render: (actions: ActionsType, record: Professor) => (
                <Actions
                  to={`/professors/${record.id}`}
                  downloadTitle={actions.downloadTitle}
                  cloudTitle={actions.cloudTitle}
                  deleteTitle={actions.deleteTitle}
                  deleteOnClick={() => archivedOneProfessor(record.id)}
                />
              ),
            },
          ]}
          datas={professors}
          name="professors"
        />
      )}
    </Layout>
  )
}
