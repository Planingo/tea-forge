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
    Header,
    Spin
} from '@planingo/ditto';
import { useState } from 'react';
import { useAddOneStudent, useStudents } from '../../Tools/Authenticated/students.js';
import './students.css'
import { Link } from 'react-router-dom'
import { Layout } from '../Layout/Layout.js';

export const Students = () => {
    const onSearch = (e: any) => {
        console.log(e)
    } 
    const {students, loading: loadingStudents} = useStudents()
	const [addOneStudent, loading] = useAddOneStudent()
    const [isGrid, setIsGrid] = useState(true)
    return <Layout>
        <Header 
            placeholder="Rechercher"
            onSearch={onSearch}
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
            refinementDetails ={{
                FirstActionIcon: UserOutlined,
                firstActionText: 'app.add.student',
                FirstForm: <StudentForm onSubmit={addOneStudent} />,
                firstActioning: loading,
                onFirstAction: addOneStudent,
                isGrid: isGrid,
                setIsGrid: () => setIsGrid(isGrid),
                formId: "student-form",
                SecondActionIcon: console.log,
                SecondForm: <></>,
                onSecondAction: console.log,
                secondActionText: 'app.edit.student',
                secondActioning: console.log,
            }}
        />
        {loadingStudents ? <Spin /> :
            isGrid ?
                <Gallery
                    datas={students}
                    name="student"
                /> : 
                <GalleryList
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
                                dataIndex: 'email',
                                key: 'email',
                                title: 'email'
                            },
                            {
                                dataIndex: 'firstname',
                                key: 'firstname',
                                title: 'firstname'
                            },
                            {
                                dataIndex: 'lastname',
                                key: 'lastname',
                                title: 'lastname'
                            },
                            {
                                dataIndex: 'actions',
                                key: 'actions',
                                title: 'actions',
                                render: (actions: any, record: any) => <div className='actions'>
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
                        name="student" />
        }
    </Layout>
}