import {
  Actions,
  ArchivedOutlined,
  Filters,
  Gallery,
  GalleryList,
  Header,
  LessonForm,
  TagOutlined,
  Tooltip,
} from "@pixel-brew/bubble-craft"
import { useState } from "react"
import { uniqBy } from "../../../helper/uniq.js"
import {
  useAddOneLesson,
  useArchivedById,
  useSearchLessons,
} from "../../Tools/Authenticated/lessons.js"
import { useSearchModules } from "../../Tools/Authenticated/modules.js"
import { Actions as ActionsType } from "../../Types/actions.js"
import { Lesson } from "../../Types/lesson.js"
import { Module } from "../../Types/module.js"
import { Pathway } from "../../Types/pathway.js"
import { Layout } from "../Layout/Layout.js"

export const Lessons = () => {
  const {
    onSearch,
    lessons,
    loading: loadingLessons,
    filterByArchived,
    filterByPathway,
    filterByModule,
  } = useSearchLessons()
  const [archivedOneLesson] = useArchivedById()
  const { modules } = useSearchModules()
  const [addOneLesson, loading] = useAddOneLesson()
  const [isGrid, setIsGrid] = useState(false)

  return (
    <Layout>
      <Header
        placeholder="search"
        onSearch={onSearch}
        isRefinementList={true}
        refinementList={{
          FirstActionIcon: TagOutlined,
          firstActionText: "app.add.lesson",
          FirstForm: (
            <LessonForm
              onSubmit={addOneLesson}
              modules={modules?.map((module: Module) => ({
                value: module.id,
                label: module.name,
              }))}
            />
          ),
          firstActioning: loading,
          onFirstAction: addOneLesson,
          isGrid: isGrid,
          setIsGrid: () => setIsGrid(!isGrid),
          formId: "lesson-form",
        }}
      />
      <Filters
        selects={[
          {
            placeholder: "pathways",
            options:
              lessons?.map((lesson) => lesson?.pathways) &&
              uniqBy(
                lessons
                  ?.map((lesson) => lesson?.pathways)
                  .flatMap((pathways) =>
                    pathways.map((pathway) => ({ value: pathway?.id, label: pathway?.name }))
                  ),
                ({ value }) => value
              ),
            allowClear: true,
            onChange: (id?: string) => filterByPathway(id),
          },
          {
            placeholder: "modules",
            options:
              lessons?.map((lesson) => lesson?.modules) &&
              uniqBy(
                lessons
                  ?.map((lesson) => lesson?.modules)
                  .flatMap((module) =>
                    module.map((module) => ({ value: module?.id, label: module?.name }))
                  ),
                ({ value }) => value
              ),
            allowClear: true,
            onChange: (id?: string) => filterByModule(id),
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
        count={{ id: "lessonCount", count: lessons?.length }}
      />
      {isGrid ? (
        <Gallery datas={lessons} loading={loadingLessons} name="lessons" />
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
              sorter: (a: Lesson, b: Lesson) => a.name.localeCompare(b.name),
            },
            { key: "start_date", haveLabel: true },
            { key: "end_date", haveLabel: true },
            {
              key: "modules",
              haveLabel: true,
              render: (modules: Module[]) =>
                modules?.map((module) => (
                  <a href={module?.link} key={module?.id}>
                    {module?.name}
                  </a>
                )),
            },
            {
              key: "pathways",
              haveLabel: true,
              render: (pathways: Pathway[]) =>
                pathways?.map((pathway) => (
                  <a href={pathway?.link} key={pathway?.id}>
                    {pathway?.name}
                  </a>
                )),
            },
            {
              key: "actions",
              haveLabel: true,
              width: "10em",
              render: (actions: ActionsType, record: Lesson) => (
                <Actions
                  to={`/lessons/${record.id}`}
                  downloadTitle={actions.downloadTitle}
                  cloudTitle={actions.cloudTitle}
                  deleteTitle={actions.deleteTitle}
                  deleteOnClick={() => archivedOneLesson(record.id)}
                />
              ),
            },
          ]}
          datas={lessons}
          name="lessons"
        />
      )}
    </Layout>
  )
}
