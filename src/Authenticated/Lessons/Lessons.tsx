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
import { Lesson } from '../../Types/lesson.js';
import { Actions } from '../../Types/actions.js';

export const Lessons = () => {
    const onSearch = (e: string) => {
        console.log
    } 
    const {lessons, loading: loadingLessons} = useLessons()
    const {modules, loading: loadingModules} = useModules_tea()
	const [addOneLesson, loading] = useAddOneLesson()
    const [isGrid, setIsGrid] = useState(false)

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
                        dataIndex: 'photo',
                        key: 'photo',
                        render: (photo: string) => 
                            (<img
                                src={photo}
                                alt="placeholder"
                            />),
                        title: 'Photo'
                    },
                    {
                        dataIndex: 'name',
                        key: 'name',
                        title: 'name',
                        sorter: (a: Lesson, b: Lesson) => a.name.localeCompare(b.name),
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
                        filters: uniqBy(lessons?.map((lesson: Lesson) => 
                            ({value: lesson.module.id, text: lesson.module.name})
                        ), ({value}: {value: string}) => value),
                        filterSearch: true,
                        onFilter: (value: string, record: Lesson) => record.module.id === value,
                        sorter: (a: Lesson, b: Lesson) => a.name.localeCompare(b.name),
                    },
                    {
                        dataIndex: 'pathway',
                        key: 'pathway',
                        title: 'pathway',
                        render: (pathway: Pathway) => <a href={`/pathways/${pathway?.id}`}>{pathway?.name}</a>,
                        filters: uniqBy(lessons?.map((lesson: Lesson) => 
                            ({value: lesson.pathway?.id, text: lesson.pathway?.name})
                        ), ({value}: {value: string}) => value),
                        filterSearch: true,
                        onFilter: (value: string, record: Lesson) => record?.pathway?.id === value,
                        sorter: (a: Lesson, b: Lesson) => a.name.localeCompare(b.name),
                    },
                    {
                        dataIndex: 'actions',
                        key: 'actions',
                        title: 'actions',
                        render: (actions: Actions, record: Lesson) => <div className='actions'>
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