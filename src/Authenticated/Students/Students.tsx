import { 
    GalleryList,
    Gallery,
    StudentForm,
    UserOutlined,
    Actions,
    Header
} from '@planingo/ditto';
import { useState } from 'react';
import { useAddOneStudent, useCountStudent, useSearchStudents } from '../../Tools/Authenticated/students.js';
import './students.css'
import { Layout } from '../Layout/Layout.js';
import { Calendar } from '../../Types/calendar.js';
import { Pathway } from '../../Types/pathway.js';
import { uniqBy } from '../../../helper/uniq.js';
import { Student } from '../../Types/student.js';
import { Actions as ActionsType } from '../../Types/actions.js';

export const Students = () => {
    const { search, students, loading: loadingStudents } = useSearchStudents()
	const [addOneStudent, loading] = useAddOneStudent()
    const [isGrid, setIsGrid] = useState(false)
    const { count } = useCountStudent()
    return <Layout>
        <Header 
            placeholder="Rechercher"
            onSearch={search}
            isRefinementList={true}
            refinementList={{
                FirstActionIcon: UserOutlined,
                firstActionText: 'app.add.student',
                FirstForm: <StudentForm onSubmit={addOneStudent} />,
                firstActioning: loading,
                onFirstAction: addOneStudent,
                isGrid: isGrid,
                setIsGrid: () => setIsGrid(!isGrid),
                formId: "student-form",
            }}
        />
        {isGrid ?
            <Gallery
                datas={students}
                name="students"
                loading={loadingStudents}
                count={count}
            />
        : <GalleryList
                columns={[
                    {
                        key: "photo",
                        render: (photo: string) => <img src={photo} alt="placeholder" />,
                    },
                    {
                        key: 'lastname',
                        sorter: (a: Student, b: Student) => a.lastname.localeCompare(b.lastname),
                    },
                    {
                        key: 'firstname',
                        sorter: (a: Student, b: Student) => a.firstname.localeCompare(b.firstname),
                    },
                    { key: 'email' },
                    {
                        key: 'pathway',
                        render: (pathway: Pathway) => <a href={`/pathways/${pathway?.id}`}>{pathway?.name}</a>,
                        filters: uniqBy(students?.map((student: Student) => ({value: student.pathway?.id, text: student.pathway?.name})) || [],({value}) => value),
                        onFilter: (value: string, record: Student) => record?.pathway?.id === value,
                    },
                    {
                        key: 'calendar',
                        render: (calendar: Calendar) => <a href={`/calendars/${calendar?.id}`}>{calendar?.name}</a>,
                        filters: uniqBy(students?.map((student: Student) => ({value: student.calendar?.id, text: student.calendar?.name})) || [],({value}) => value),
                        onFilter: (value: string, record: Student) => record?.calendar?.id === value,
                    },
                    {
                        key: 'actions',
                        render: (actions: ActionsType, record: Student) => <Actions 
                            to={`/students/${record.id}`}
                            downloadTitle={actions.downloadTitle}
                            cloudTitle={actions.cloudTitle}
                            deleteTitle={actions.deleteTitle}
                        />
                    }
                ]}
                datas={students}
                name="students"
            />
        }
    </Layout>
}