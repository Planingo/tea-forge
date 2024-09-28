import {
  Actions,
  ArchivedOutlined,
  ExperimentOutlined,
  Filters,
  Gallery,
  GalleryList,
  Header,
  PathwayForm,
  Tooltip,
} from "@pixel-brew/bubble-craft"
import { useState } from "react"
import { uniqBy } from "../../../helper/uniq.js"
import { useSearchCalendars } from "../../Tools/Authenticated/calendars.js"
import {
  useAddOnePathway,
  useArchivedById,
  useSearchPathways,
} from "../../Tools/Authenticated/pathways.js"
import { Actions as ActionsType } from "../../Types/actions.js"
import { Calendar } from "../../Types/calendar.js"
import { Pathway } from "../../Types/pathway.js"
import { Layout } from "../Layout/Layout.js"

export const Pathways = () => {
  const {
    pathways,
    loading: loadingPathways,
    onSearch,
    filterByArchived,
    filterByCalendar,
  } = useSearchPathways()
  const { calendars } = useSearchCalendars()
  const [archivedOnePathway] = useArchivedById()
  const [addOnePathway, loading] = useAddOnePathway()
  const [isGrid, setIsGrid] = useState(false)
  return (
    <Layout>
      <Header
        placeholder="search"
        onSearch={onSearch}
        isRefinementList={true}
        refinementList={{
          FirstActionIcon: ExperimentOutlined,
          firstActionText: "app.add.pathway",
          FirstForm: <PathwayForm onSubmit={addOnePathway} calendars={calendars} />,
          firstActioning: loading,
          onFirstAction: addOnePathway,
          isGrid: isGrid,
          setIsGrid: () => setIsGrid(!isGrid),
          formId: "pathway-form",
        }}
      />
      <Filters
        selects={[
          {
            placeholder: "calendars",
            options:
              pathways?.map((pathway) => pathway?.calendars) &&
              uniqBy(
                pathways
                  ?.map((pathway) => pathway?.calendars)
                  .flatMap((calendars) =>
                    calendars?.map((calendar) => ({ value: calendar?.id, label: calendar?.name }))
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
        count={{ id: "pathwayCount", count: pathways?.length }}
      />
      {isGrid ? (
        <Gallery datas={pathways} loading={loadingPathways} name="pathways" />
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
              key: "student_number",
              label: "student.label",
              haveLabel: true,
            },
            {
              key: "actions",
              haveLabel: true,
              width: "10em",
              render: (actions: ActionsType, record: Pathway) => (
                <Actions
                  to={`/pathways/${record.id}`}
                  downloadTitle={actions.downloadTitle}
                  cloudTitle={actions.cloudTitle}
                  deleteTitle={actions.deleteTitle}
                  deleteOnClick={() => archivedOnePathway(record.id)}
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
