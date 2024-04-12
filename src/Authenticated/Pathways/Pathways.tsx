import {
  Actions,
  ExperimentOutlined,
  Gallery,
  GalleryList,
  Header,
  PathwayForm,
  Spin,
} from "@pixel-brew/bubble-craft"
import { useState } from "react"
import { useAddOnePathway, useSearchPathways } from "../../Tools/Authenticated/pathways.js"
import { Actions as ActionsType } from "../../Types/actions.js"
import { Pathway } from "../../Types/pathway.js"
import { Layout } from "../Layout/Layout.js"

export const Pathways = () => {
  const onSearch = (e: string) => {
    console.log
  }
  const { pathways, loading: loadingPathways } = useSearchPathways()
  const [addOnePathway, loading] = useAddOnePathway()
  const [isGrid, setIsGrid] = useState(false)
  return (
    <Layout>
      <Header
        placeholder="Rechercher"
        onSearch={onSearch}
        isRefinementList={true}
        refinementList={{
          FirstActionIcon: ExperimentOutlined,
          firstActionText: "app.add.pathway",
          FirstForm: <PathwayForm onSubmit={addOnePathway} />,
          firstActioning: loading,
          onFirstAction: addOnePathway,
          isGrid: isGrid,
          setIsGrid: () => setIsGrid(!isGrid),
          formId: "pathway-form",
        }}
        refinementDetails={{
          FirstActionIcon: ExperimentOutlined,
          firstActionText: "app.add.pathway",
          FirstForm: <PathwayForm onSubmit={addOnePathway} />,
          firstActioning: loading,
          onFirstAction: addOnePathway,
          isGrid: isGrid,
          setIsGrid: () => setIsGrid(isGrid),
          formId: "pathway-form",
          SecondActionIcon: console.log,
          SecondForm: <></>,
          onSecondAction: console.log,
          secondActionText: "app.edit.pathway",
          secondActioning: console.log,
        }}
      />
      {loadingPathways ? (
        <Spin />
      ) : isGrid ? (
        <Gallery datas={pathways} name="pathways" />
      ) : (
        <GalleryList
          columns={[
            {
              key: "photo",
              render: (photo: string) => <img src={photo} alt="placeholder" />,
            },
            { key: "email" },
            { key: "firstname" },
            { key: "lastname" },
            {
              key: "actions",
              render: (actions: ActionsType, record: Pathway) => (
                <Actions
                  to={`/pathways/${record.id}`}
                  downloadTitle={actions.downloadTitle}
                  cloudTitle={actions.cloudTitle}
                  deleteTitle={actions.deleteTitle}
                />
              ),
            },
          ]}
          datas={pathways}
          name="pathways"
        />
      )}
    </Layout>
  )
}
