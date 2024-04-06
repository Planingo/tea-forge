import { useNavigate, useParams } from "react-router-dom"
import { useAddOneLesson, useGetLessonById } from "../../Tools/Authenticated/lessons.js"
import { useState } from "react"
import { Layout } from "../Layout/Layout.js"
import { Header, UserOutlined, LessonForm } from "@planingo/ditto"
import { Details } from "../Layout/Details.js"

export const Lesson = () => {
    const {id} = useParams()
    const {lesson, loading: loadingLesson} = useGetLessonById(id!)
    const navigate = useNavigate()
	const [addOneLesson, loading] = useAddOneLesson()
    const [isGrid, setIsGrid] = useState(false)

    if (loadingLesson) return

    return <Layout>
        <Header
            placeholder="Rechercher"
            isRefinementList={false}
            refinementDetails={{
                FirstActionIcon: UserOutlined,
                firstActionText: 'app.add.lesson',
                FirstForm: <LessonForm onSubmit={addOneLesson} />,
                firstActioning: loading,
                onFirstAction: addOneLesson,
                isGrid: isGrid,
                setIsGrid: () => setIsGrid(!isGrid),
                formId: "lesson-form",
                backTo: () => navigate('/lessons'),
                SecondActionIcon: UserOutlined,
                secondActionText: 'app.edit.lesson',
                SecondForm: <LessonForm onSubmit={addOneLesson} />,
                secondActioning: loading,
                onSecondAction: addOneLesson,
                Info: <div className="infos">
                    <img src={lesson?.photo} alt={lesson?.alt}/>
                    <div className="info">
                        <p>{lesson?.name.toUpperCase()}</p>
                    </div>
                </div>,
            }}
        />
        <Details entityName={lesson?.name} events={lesson?.events} />
    </Layout>
}