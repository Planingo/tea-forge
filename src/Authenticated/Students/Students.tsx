import { 
    GalleryList,
    Gallery,
    StudentForm,
    UserOutlined,
    Tooltip,
    DownloadOutlined,
    CloudUploadOutlined,
    DeleteOutlined,
    ExportOutlined,
    Header
} from '@planingo/ditto';
import { useState } from 'react';
import { useAddOneStudent, useCountStudent, useSearchStudents } from '../../Tools/Authenticated/students.js';
import './students.css'
import { Link } from 'react-router-dom';
import { Layout } from '../Layout/Layout.js';
import { Calendar } from '../../Types/calendar.js';
import { Pathway } from '../../Types/pathway.js';
import { uniqBy } from '../../../helper/uniq.js';
import { Student } from '../../Types/student.js';
import { Actions } from '../../Types/actions.js';

export const Students = () => {
    const { search, students, loading: loadingStudents } = useSearchStudents()
	const [addOneStudent, loading] = useAddOneStudent()
    const [isGrid, setIsGrid] = useState(false)
    const { count } = useCountStudent()
    console.log(students)
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
                        dataIndex: 'src',
                        key: 'src',
                        render: (src: string) => 
                            (<img
                                src={src}
                                alt="placeholder"
                            />),
                        title: 'Photo'
                    },
                    {
                        dataIndex: 'lastname',
                        key: 'lastname',
                        title: 'lastname',
                        sorter: (a: Student, b: Student) => a.lastname.localeCompare(b.lastname),
                    },
                    {
                        dataIndex: 'firstname',
                        key: 'firstname',
                        title: 'firstname',
                        sorter: (a: Student, b: Student) => a.firstname.localeCompare(b.firstname),
                    },
                    {
                        dataIndex: 'email',
                        key: 'email',
                        title: 'email',
                    },
                    {
                        dataIndex: 'pathway',
                        key: 'pathway',
                        title: 'pathway',
                        render: (pathway: Pathway) => <a href={`/pathways/${pathway?.id}`}>{pathway?.name}</a>,
                        filters: uniqBy(students?.map((student: Student) => ({value: student.pathway?.id, text: student.pathway?.name})) || [],({value}) => value),
                        filterSearch: true,
                        onFilter: (value: string, record: Student) => record?.pathway?.id === value,
                    },
                    {
                        dataIndex: 'calendar',
                        key: 'calendar',
                        title: 'calendar',
                        render: (calendar: Calendar) => <a href={`/calendars/${calendar?.id}`}>{calendar?.name}</a>,
                        filters: uniqBy(students?.map((student: Student) => ({value: student.calendar?.id, text: student.calendar?.name})) || [],({value}) => value),
                        filterSearch: true,
                        onFilter: (value: string, record: Student) => record?.calendar?.id === value,
                    },
                    {
                        dataIndex: 'actions',
                        key: 'actions',
                        title: 'actions',
                        render: (actions: Actions, record: Student) => <div className='actions'>
                                <Link to={`/students/${record.id}`} replace={true}>
                                    <Tooltip title={'Détail'} placement='bottom'>
                                        <ExportOutlined className='download' />
                                    </Tooltip>
                                </Link>
                            <Tooltip title={actions.downloadTitle || 'Télécharger'} placement='bottom'>
                                <DownloadOutlined className='download' />
                            </Tooltip>
                            <Tooltip title={actions.cloudTitle || 'Envoyer'} placement='bottom'>
                                <CloudUploadOutlined className='cloud' />
                            </Tooltip>
                            <Tooltip title={actions.deleteTitle || 'Supprimer'} placement='bottom'>
                                <DeleteOutlined className='delete' />
                            </Tooltip>
                        </div>
                    }
                ]}
                datas={students}
                name="students"
            />
        }
    </Layout>
}