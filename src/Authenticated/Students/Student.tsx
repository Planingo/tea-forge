import { useNavigate, useParams } from "react-router-dom"
import { useAddOneStudent, useGetStudentById } from "../../Tools/Authenticated/students.js"
import { useState } from "react"
import { Layout } from "../Layout/Layout.js"
import { Header, UserOutlined, StudentForm } from "@planingo/ditto"
import { Details } from "../Layout/Details.js"

export const Student = () => {
    const {id} = useParams()
    const {student, loading: loadingStudent} = useGetStudentById(id!)
    const navigate = useNavigate()
	const [addOneStudent, loading] = useAddOneStudent()
    const [isGrid, setIsGrid] = useState(false)

    if (loadingStudent) return

    return <Layout>
        <Header
            placeholder="Rechercher"
            isRefinementList={false}
            refinementDetails={{
                FirstActionIcon: UserOutlined,
                firstActionText: 'app.add.student',
                FirstForm: <StudentForm onSubmit={addOneStudent} />,
                firstActioning: loading,
                onFirstAction: addOneStudent,
                isGrid: isGrid,
                setIsGrid: () => setIsGrid(!isGrid),
                formId: "student-form",
                backTo: () => navigate('/students'),
                SecondActionIcon: UserOutlined,
                secondActionText: 'app.edit.student',
                SecondForm: <StudentForm onSubmit={addOneStudent} />,
                secondActioning: loading,
                onSecondAction: addOneStudent,
                Info: <div className="infos">
                    <img src={student?.src} alt={student?.alt}/>
                    <div className="info">
                        <p>{student?.lastname.toUpperCase()} {student?.firstname}</p>
                        <p>{student?.email}</p>
                    </div>
                </div>,
            }}
        />
        <Details entityName={student?.name} events={student?.events} />
    </Layout>
}