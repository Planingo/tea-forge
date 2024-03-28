import { 
    GalleryList,
    Gallery,
    LessonForm,
    TagOutlined,
    Tooltip,
    DownloadOutlined,
    CloudUploadOutlined,
    DeleteOutlined,
    ExportOutlined,
    Header,
    Spin
} from '@planingo/ditto';
import { useState } from 'react';
import { useAddOneLesson, useLessons } from '../../Tools/Authenticated/lessons.js';
import { Link } from 'react-router-dom';
import { Layout } from '../Layout/Layout.js';
import { useModules_tea } from '../../Tools/Authenticated/modules.js';
import { Module } from '../../Types/module.js';
export const Lessons = () => {
    const onSearch = (e: any) => {
        console.log
    } 
    const {lessons, loading: loadingLessons} = useLessons()
    const {modules, loading: loadingModules} = useModules_tea()
	const [addOneLesson, loading] = useAddOneLesson()
    const [isGrid, setIsGrid] = useState(true)
    return <Layout>
    <Header 
        placeholder="Rechercher"
        onSearch={onSearch}
        isRefinementList={true}
        refinementList={{
            FirstActionIcon: TagOutlined,
            firstActionText: 'app.add.lesson',
            FirstForm: <LessonForm onSubmit={addOneLesson} modules={modules?.map((module: Module) => ({value: module.id, label: module.name}))} />,
            firstActioning: loading,
            onFirstAction: addOneLesson,
            isGrid: isGrid,
            setIsGrid: () => setIsGrid(!isGrid),
            formId: "lesson-form",
        }}
        refinementDetails ={{
            FirstActionIcon: TagOutlined,
            firstActionText: 'app.add.lesson',
            FirstForm: <LessonForm onSubmit={addOneLesson} />,
            firstActioning: loading,
            onFirstAction: addOneLesson,
            isGrid: isGrid,
            setIsGrid: () => setIsGrid(isGrid),
            formId: "lesson-form",
            SecondActionIcon: console.log,
            SecondForm: <></>,
            onSecondAction: console.log,
            secondActionText: 'app.edit.lesson',
            secondActioning: console.log,
        }}
    />
    {loadingLessons ? <Spin /> :
        isGrid ?
            <Gallery
                datas={lessons}
                name="lesson"
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
                        dataIndex: 'name',
                        key: 'name',
                        title: 'name'
                    },
                    {
                        dataIndex: 'start_date',
                        key: 'start_date',
                        title: 'Start date'
                    },
                    {
                        dataIndex: 'end_date',
                        key: 'end_date',
                        title: 'End date'
                    },
                    {
                        dataIndex: 'module',
                        key: 'module',
                        title: 'Module'
                    },
                    {
                        dataIndex: 'actions',
                        key: 'actions',
                        title: 'actions',
                        render: (actions: any, record: any) => <div className='actions'>
                                <Link to={`/lessons/${record.id}`} replace={true}>
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
                datas={lessons}
                name="lesson" />
    }
    </Layout>
}