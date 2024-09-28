import {
  Actions,
  ArchivedOutlined,
  Filters,
  Gallery,
  GalleryList,
  Header,
  ModuleForm,
  TagsOutlined,
  Tooltip,
} from "@pixel-brew/bubble-craft"
import { useState } from "react"
import { uniqBy } from "../../../helper/uniq.js"
import {
  useAddOneModule,
  useArchivedById,
  useSearchModules,
} from "../../Tools/Authenticated/modules.js"
import { useSearchPathways } from "../../Tools/Authenticated/pathways.js"
import { Actions as ActionsType } from "../../Types/actions.js"
import { Calendar } from "../../Types/calendar.js"
import { Module } from "../../Types/module.js"
import { Pathway } from "../../Types/pathway.js"
import { Layout } from "../Layout/Layout.js"
import "./modules.css"

export const Modules = () => {
  const {
    modules,
    loading: loadingModules,
    onSearch,
    filterByPathway,
    filterByCalendar,
    filterByArchived,
  } = useSearchModules()
  const { pathways } = useSearchPathways()
  const [archivedOneModule] = useArchivedById()
  const [addOneModule, loading] = useAddOneModule()
  const [isGrid, setIsGrid] = useState(false)
  return (
    <Layout>
      <Header
        placeholder="search"
        onSearch={onSearch}
        isRefinementList={true}
        refinementList={{
          FirstActionIcon: TagsOutlined,
          firstActionText: "app.add.module",
          FirstForm: <ModuleForm onSubmit={addOneModule} pathways={pathways} />,
          firstActioning: loading,
          onFirstAction: addOneModule,
          isGrid: isGrid,
          setIsGrid: () => setIsGrid(!isGrid),
          formId: "module-form",
        }}
      />
      <Filters
        selects={[
          {
            placeholder: "pathways",
            options:
              modules?.map((module) => module?.pathways) &&
              uniqBy(
                modules
                  ?.map((module) => module?.pathways)
                  .flatMap((pathways) =>
                    pathways.map((pathway) => ({ value: pathway?.id, label: pathway?.name }))
                  ),
                ({ value }) => value
              ),
            allowClear: true,
            onChange: (id?: string) => filterByPathway(id),
          },
          {
            placeholder: "calendars",
            options:
              modules?.map((module) => module?.calendars) &&
              uniqBy(
                modules
                  ?.map((module) => module?.calendars)
                  .flatMap((calendars) =>
                    calendars.map((calendar) => ({ value: calendar?.id, label: calendar?.name }))
                  ),
                ({ value }) => value
              ),
            allowClear: true,
            onChange: (id?: string) => filterByCalendar(id),
          },
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
        count={{ id: "moduleCount", count: modules?.length }}
      />
      {isGrid ? (
        <Gallery datas={modules} loading={loadingModules} name="modules" />
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
              key: "name",
              haveLabel: true,
              sorter: (a: Module, b: Module) => a.name.localeCompare(b.name),
            },
            {
              key: "pathways",
              haveLabel: true,
              render: (pathways: Pathway[]) => (
                <div className="container-module">
                  {pathways?.map((pathway) => (
                    <a href={pathway?.link} key={pathway?.id}>
                      {pathway?.name}
                    </a>
                  ))}
                </div>
              ),
            },
            {
              key: "calendars",
              haveLabel: true,
              render: (calendars: Calendar[]) =>
                calendars?.map((calendar) => (
                  <a href={calendar?.link} key={calendar?.id}>
                    {calendar?.name}
                  </a>
                )),
            },
            {
              key: "actions",
              haveLabel: true,
              width: "10em",
              render: (actions: ActionsType, record: Module) => (
                <Actions
                  to={`/modules/${record.id}`}
                  downloadTitle={actions.downloadTitle}
                  cloudTitle={actions.cloudTitle}
                  deleteTitle={actions.deleteTitle}
                  deleteOnClick={() => archivedOneModule(record.id)}
                />
              ),
            },
          ]}
          datas={modules}
          name="modules"
        />
      )}
    </Layout>
  )
}
