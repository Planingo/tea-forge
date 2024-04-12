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
import { useCalendars } from "../../Tools/Authenticated/calendars.js"
import { useCompanies } from "../../Tools/Authenticated/companies.js"
import { usePathways_tea } from "../../Tools/Authenticated/pathways.js"
import {
  useAddOneStudent,
  useArchivedById,
  useCountStudent,
  useSearchStudents,
} from "../../Tools/Authenticated/students.js"
import { Actions as ActionsType } from "../../Types/actions.js"
import { Calendar } from "../../Types/calendar.js"
import { Company } from "../../Types/company.js"
import { Pathway } from "../../Types/pathway.js"
import { Student } from "../../Types/student.js"
import { Layout } from "../Layout/Layout.js"
import "./students.css"

export const Students = () => {
  const {
    search,
    students,
    filterByPathway,
    filterByArchived,
    filterByCalendar,
    filterByCompany,
    loading: loadingStudents,
  } = useSearchStudents()
  const { companies } = useCompanies()
  const { calendars } = useCalendars()
  const { pathways } = usePathways_tea()
  const [addOneStudent, loading] = useAddOneStudent()
  const [archivedOneStudent] = useArchivedById()
  const [isGrid, setIsGrid] = useState(false)
  const { count } = useCountStudent()
  return (
    <Layout>
      <Header
        placeholder="search"
        onSearch={search}
        isRefinementList={true}
        refinementList={{
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
        }}
      />
      <Filters
        selects={[
          {
            placeholder: "pathways",
            options:
              students?.map((student) => student?.pathways) &&
              uniqBy(
                students
                  ?.map((student) => student?.pathways)
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
              students?.map((student) => student?.calendars) &&
              uniqBy(
                students
                  ?.map((student) => student?.calendars)
                  .flatMap((calendars) =>
                    calendars.map((calendar) => ({ value: calendar?.id, label: calendar?.name }))
                  ),
                ({ value }) => value
              ),
            allowClear: true,
            onChange: (id?: string) => filterByCalendar(id),
          },
          {
            placeholder: "companies",
            options:
              students?.flatMap((student) =>
                student?.companies.map((company) => ({ id: company.id, name: company.name }))
              ) &&
              uniqBy(
                students
                  ?.flatMap((student) =>
                    student?.companies.map((company) => ({ id: company.id, name: company.name }))
                  )
                  .map((company) => ({ value: company?.id, label: company?.name })),
                ({ value }) => value
              ),
            allowClear: true,
            onChange: (id?: string) => filterByCompany(id),
          },
          {
            placeholder: "archived",
            defaultValue: "non archivé",
            options: [
              { value: null, label: "tous" },
              { value: true, label: "archivé" },
              { value: false, label: "non archivé" },
            ],
            allowClear: false,
            onChange: (isArchived?: boolean) => filterByArchived(isArchived),
          },
        ]}
        count={{ id: "student", count: students?.length }}
      />
      {isGrid ? (
        <Gallery datas={students} name="students" loading={loadingStudents} count={count} />
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
              render: (photo: string, record: Student) => (
                <img src={photo} alt={`${record.name}`} />
              ),
            },
            {
              key: "lastname",
              haveLabel: true,
              sorter: (a: Student, b: Student) => a.lastname.localeCompare(b.lastname),
            },
            {
              key: "firstname",
              haveLabel: true,
              sorter: (a: Student, b: Student) => a.firstname.localeCompare(b.firstname),
            },
            { key: "email", haveLabel: true },
            {
              key: "pathways",
              width: "10em",
              haveLabel: true,
              render: (pathways: Pathway[]) =>
                pathways?.map((pathway) => (
                  <a href={pathway?.link} key={pathway?.id}>
                    {pathway?.name}
                  </a>
                )),
            },
            {
              key: "calendars",
              width: "10em",
              haveLabel: true,
              render: (calendars: Calendar[]) =>
                calendars?.map((calendar) => (
                  <a href={calendar?.link} key={calendar?.id}>
                    {calendar?.name}
                  </a>
                )),
            },
            {
              key: "companies",
              haveLabel: true,
              render: (companies: Company[]) =>
                companies?.map((company) => (
                  <a href={company?.link} key={company?.id}>
                    {company?.name}
                  </a>
                )),
            },
            {
              key: "actions",
              width: "10em",
              haveLabel: true,
              render: (actions: ActionsType, record: Student) => (
                <Actions
                  to={`/students/${record.id}`}
                  downloadTitle={actions.downloadTitle}
                  cloudTitle={actions.cloudTitle}
                  deleteTitle={actions.deleteTitle}
                  deleteOnClick={() => archivedOneStudent(record.id)}
                />
              ),
            },
          ]}
          datas={students}
          name="students"
        />
      )}
    </Layout>
  )
}
