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
import { Pathway } from '../../Types/pathway.js';
import { uniqBy } from '../../../helper/uniq.js';

export const Lessons = () => {
    const onSearch = (e: any) => {
        console.log
    } 
    const {lessons, loading: loadingLessons} = useLessons()
    const {modules, loading: loadingModules} = useModules_tea()
	const [addOneLesson, loading] = useAddOneLesson()
    const [isGrid, setIsGrid] = useState(false)

    console.log(lessons?.map((lesson: any) => 
        ({value: lesson.module.id, text: lesson.module.name})
    ))

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
                name="lessons"
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
                        title: 'name',
                        sorter: (a: any, b: any) => a.name.localeCompare(b.name),
                    },
                    {
                        dataIndex: 'start_date',
                        key: 'start_date',
                        title: 'Start date',
                    },
                    {
                        dataIndex: 'end_date',
                        key: 'end_date',
                        title: 'End date',
                    },
                    {
                        dataIndex: 'module',
                        key: 'module',
                        title: 'Module',
                        render: (module: Module) => <a href={`/modules/${module?.id}`}>{module?.name}</a>,
                        filters: uniqBy(lessons?.map((lesson: any) => 
                            ({value: lesson.module.id, text: lesson.module.name})
                        ), ({value}: any) => value),
                        filterSearch: true,
                        onFilter: (value: string, record: any) => record.module.id === value,
                        sorter: (a: any, b: any) => a.name.localeCompare(b.name),
                    },
                    {
                        dataIndex: 'pathway',
                        key: 'pathway',
                        title: 'pathway',
                        render: (pathway: Pathway) => <a href={`/pathways/${pathway?.id}`}>{pathway?.name}</a>,
                        filters: uniqBy(lessons?.map((lesson: any) => 
                            ({value: lesson.pathway?.id, text: lesson.pathway?.name})
                        ), ({value}: any) => value),
                        filterSearch: true,
                        onFilter: (value: string, record: any) => record?.pathway?.id === value,
                        sorter: (a: any, b: any) => a.name.localeCompare(b.name),
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
                name="lessons" />
    }
    </Layout>
}