import {
  Actions,
  Gallery,
  GalleryList,
  Header,
  ProfessorForm,
  Spin,
  TeamOutlined,
} from "@planingo/ditto"
import { useState } from "react"
import { useAddOneProfessor, useProfessors } from "../../Tools/Authenticated/professors.js"
import { Actions as ActionsType } from "../../Types/actions.js"
import { Professor } from "../../Types/professor.js"
import { Layout } from "../Layout/Layout.js"

export const Professors = () => {
  const onSearch = (e: string) => {
    console.log
  }
  const { professors, loading: loadingProfessors } = useProfessors()
  const [addOneProfessor, loading] = useAddOneProfessor()
  const [isGrid, setIsGrid] = useState(false)
  return (
    <Layout>
      <Header
        placeholder="Rechercher"
        onSearch={onSearch}
        isRefinementList={true}
        refinementList={{
          FirstActionIcon: TeamOutlined,
          firstActionText: "app.add.professor",
          FirstForm: <ProfessorForm onSubmit={addOneProfessor} />,
          firstActioning: loading,
          onFirstAction: addOneProfessor,
          isGrid: isGrid,
          setIsGrid: () => setIsGrid(!isGrid),
          formId: "professor-form",
        }}
        refinementDetails={{
          FirstActionIcon: TeamOutlined,
          firstActionText: "app.add.professor",
          FirstForm: <ProfessorForm onSubmit={addOneProfessor} />,
          firstActioning: loading,
          onFirstAction: addOneProfessor,
          isGrid: isGrid,
          setIsGrid: () => setIsGrid(isGrid),
          formId: "professor-form",
          SecondActionIcon: console.log,
          SecondForm: <></>,
          onSecondAction: console.log,
          secondActionText: "app.edit.professor",
          secondActioning: console.log,
        }}
      />
      {loadingProfessors ? (
        <Spin />
      ) : isGrid ? (
        <Gallery datas={professors} name="professors" />
      ) : (
        <GalleryList
          columns={[
            {
              key: "photo",
              render: (photo: string) => <img src={photo} alt="placeholder" />,
            },
            {
              key: "lastname",
              sorter: (a: Professor, b: Professor) => a.lastname.localeCompare(b.lastname),
            },
            {
              key: "firstname",
              sorter: (a: Professor, b: Professor) => a.firstname.localeCompare(b.firstname),
            },
            { key: "email" },
            {
              key: "actions",
              render: (actions: ActionsType, record: Professor) => (
                <Actions
                  to={`/professors/${record.id}`}
                  downloadTitle={actions.downloadTitle}
                  cloudTitle={actions.cloudTitle}
                  deleteTitle={actions.deleteTitle}
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
