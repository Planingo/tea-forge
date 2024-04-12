import { Header, StudentEditForm, StudentForm, UserOutlined } from "@pixel-brew/bubble-craft"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useSearchCalendars } from "../../Tools/Authenticated/calendars.js"
import { useSearchCompanies } from "../../Tools/Authenticated/companies.js"
import { useSearchPathways } from "../../Tools/Authenticated/pathways.js"
import { useAddOneStudent, useGetStudentById } from "../../Tools/Authenticated/students.js"
import { Details } from "../Layout/Details.js"
import { Layout } from "../Layout/Layout.js"

export const Student = () => {
  const { id } = useParams()
  const { student, loading: loadingStudent } = useGetStudentById(id!)
  const navigate = useNavigate()
  const [addOneStudent, loading] = useAddOneStudent()
  const [isGrid, setIsGrid] = useState(false)
  const { companies } = useSearchCompanies()
  const { calendars } = useSearchCalendars()
  const { pathways } = useSearchPathways()

  if (loadingStudent) return

  return (
    <Layout>
      <Header
        placeholder="search"
        isRefinementList={false}
        refinementDetails={{
          FirstActionIcon: UserOutlined,
          firstActionText: "app.add.student",
          FirstForm: (
            <StudentForm
              onSubmit={addOneStudent}
              companies={companies}
              pathways={pathways}
              calendars={calendars}
            />
          ),
          firstActioning: loading,
          onFirstAction: addOneStudent,
          isGrid: isGrid,
          setIsGrid: () => setIsGrid(!isGrid),
          formId: "student-form",
          backTo: () => navigate("/students"),
          SecondActionIcon: UserOutlined,
          secondActionText: "app.edit.student",
          SecondForm: (
            <StudentEditForm
              onSubmit={addOneStudent}
              companies={companies}
              pathways={pathways}
              calendars={calendars}
              student={student}
            />
          ),
          secondActioning: loading,
          onSecondAction: addOneStudent,
          Info: (
            <div className="infos">
              <img src={student?.photo} alt={student?.alt} />
              <div className="info">
                <p>
                  {student?.lastname.toUpperCase()} {student?.firstname}
                </p>
                <p>{student?.email}</p>
              </div>
            </div>
          ),
        }}
      />
      <Details entityName={student?.name} events={student?.events} />
    </Layout>
  )
}
