import {
  Actions,
  ArchivedOutlined,
  Filters,
  Gallery,
  GalleryList,
  Header,
  StudentForm,
  Tooltip,
  UserOutlined,
} from "@pixel-brew/bubble-craft"
import { useState } from "react"
import { uniqBy } from "../../../helper/uniq.js"
import {
  useAddOneCalendar,
  useCountCalendar,
  useSearchCalendars,
} from "../../Tools/Authenticated/calendars.js"
import { Actions as ActionsType } from "../../Types/actions.js"
import { Calendar } from "../../Types/calendar.js"
import { Pathway } from "../../Types/pathway.js"
import { Layout } from "../Layout/Layout.js"

export const Calendars = () => {
  const {
    onSearch,
    filterByArchived,
    filterByPathway,
    calendars,
    loading: loadingCalendars,
  } = useSearchCalendars()
  const [addOneCalendar, loading] = useAddOneCalendar()
  const [isGrid, setIsGrid] = useState(false)
  const { count } = useCountCalendar()
  return (
    <Layout>
      <Header
        placeholder="search"
        onSearch={onSearch}
        isRefinementList={true}
        refinementList={{
          FirstActionIcon: UserOutlined,
          firstActionText: "app.add.calendar",
          FirstForm: <StudentForm onSubmit={addOneCalendar} />,
          firstActioning: loading,
          onFirstAction: addOneCalendar,
          isGrid: isGrid,
          setIsGrid: () => setIsGrid(!isGrid),
          formId: "calendar-form",
        }}
      />
      <Filters
        selects={[
          {
            placeholder: "pathways",
            options:
              calendars?.map((calendar) => calendar?.pathway) &&
              uniqBy(
                calendars?.map((calendar) => ({
                  value: calendar?.pathway?.id,
                  label: calendar?.pathway?.name,
                })),
                ({ value }) => value
              ),
            allowClear: true,
            onChange: (id?: string) => filterByPathway(id),
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
        count={{ id: "calendarCount", count: calendars?.length }}
      />
      {isGrid ? (
        <Gallery datas={calendars} name="calendars" loading={loadingCalendars} count={count} />
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
              key: "pathway",
              width: "20em",
              haveLabel: true,
              render: (pathway: Pathway) => (
                <a href={pathway?.link} key={pathway?.id}>
                  {pathway?.name}
                </a>
              ),
            },
            {
              key: "actions",
              width: "10em",
              haveLabel: true,
              render: (actions: ActionsType, record: Calendar) => (
                <Actions
                  to={`/calendars/${record.id}`}
                  downloadTitle={actions.downloadTitle}
                  // downloadTitleOnClick={() => generatePDF(record)}
                  cloudTitle={actions.cloudTitle}
                  deleteTitle={actions.deleteTitle}
                />
              ),
            },
          ]}
          datas={calendars}
          name="calendars"
        />
      )}
    </Layout>
  )
}
