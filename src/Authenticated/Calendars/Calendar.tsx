import {
  Calendar as CalendarBubbleCraft,
  Header,
  StudentForm,
  UserOutlined,
} from "@pixel-brew/bubble-craft"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAddOneCalendar, useGetCalendarById } from "../../Tools/Authenticated/calendars.js"
import { Layout } from "../Layout/Layout.js"
import "./calendar.css"

export const Calendar = () => {
  const { id } = useParams()
  const { calendar, loading: loadingCalendar } = useGetCalendarById(id!)
  const navigate = useNavigate()
  const [addOneCalendar, loading] = useAddOneCalendar()
  const [isGrid, setIsGrid] = useState(false)

  if (loadingCalendar) return

  return (
    <Layout>
      <Header
        placeholder="Rechercher"
        isRefinementList={false}
        refinementDetails={{
          FirstActionIcon: UserOutlined,
          firstActionText: "app.add.calendar",
          FirstForm: <StudentForm onSubmit={addOneCalendar} />,
          firstActioning: loading,
          onFirstAction: addOneCalendar,
          isGrid: isGrid,
          setIsGrid: () => setIsGrid(!isGrid),
          formId: "calendar-form",
          backTo: () => navigate("/calendars"),
          SecondActionIcon: UserOutlined,
          secondActionText: "app.edit.calendar",
          SecondForm: <StudentForm onSubmit={addOneCalendar} />,
          secondActioning: loading,
          onSecondAction: addOneCalendar,
          Info: (
            <div className="infos">
              <img src={calendar?.photo} alt={calendar?.alt} />
              <div className="info">
                <p>{calendar?.name.toUpperCase()}</p>
              </div>
            </div>
          ),
        }}
      />
      {
        <div className="details">
          <div>
            <h1>Contraintes</h1>
          </div>
          <div>
            <CalendarBubbleCraft events={[]} />
          </div>
        </div>
      }
    </Layout>
  )
}
