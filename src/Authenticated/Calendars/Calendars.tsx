import { Actions, Gallery, GalleryList, Header, StudentForm, UserOutlined } from "@planingo/ditto"
import { useState } from "react"
import {
  useAddOneCalendar,
  useCountCalendar,
  useSearchCalendars,
} from "../../Tools/Authenticated/calendars.js"
import { Actions as ActionsType } from "../../Types/actions.js"
import { Calendar } from "../../Types/calendar.js"
import { Layout } from "../Layout/Layout.js"

export const Calendars = () => {
  const { search, calendars, loading: loadingCalendars } = useSearchCalendars()
  const [addOneCalendar, loading] = useAddOneCalendar()
  const [isGrid, setIsGrid] = useState(false)
  const { count } = useCountCalendar()
  return (
    <Layout>
      <Header
        placeholder="Rechercher"
        onSearch={search}
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
      {isGrid ? (
        <Gallery datas={calendars} name="calendars" loading={loadingCalendars} count={count} />
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
              render: (actions: ActionsType, record: Calendar) => (
                <Actions
                  to={`/calendars/${record.id}`}
                  downloadTitle={actions.downloadTitle}
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
