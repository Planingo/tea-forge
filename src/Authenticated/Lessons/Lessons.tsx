import { 
    GalleryList,
    Gallery,
    LessonForm,
    TagOutlined,
    Actions,
    Header,
    Spin
} from '@planingo/ditto';
import { useState } from 'react';
import { useAddOneLesson, useLessons } from '../../Tools/Authenticated/lessons.js';
import { Layout } from '../Layout/Layout.js';
import { useModules_tea } from '../../Tools/Authenticated/modules.js';
import { Module } from '../../Types/module.js';
import { Pathway } from '../../Types/pathway.js';
import { uniqBy } from '../../../helper/uniq.js';
import { Lesson } from '../../Types/lesson.js';
import { Actions as ActionsType } from '../../Types/actions.js';

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
                        key: 'photo',
                        render: (photo: string) => 
                            (<img
                                src={photo}
                                alt="placeholder"
                            />),
                    },
                    {
                        key: 'name',
                        sorter: (a: Lesson, b: Lesson) => a.name.localeCompare(b.name),
                    },
                    { key: 'start_date' },
                    { key: 'end_date' },
                    {
                        key: 'module',
                        render: (module: Module) => <a href={`/modules/${module?.id}`}>{module?.name}</a>,
                        filters: uniqBy(lessons?.map((lesson: Lesson) => 
                            ({value: lesson.module.id, text: lesson.module.name})
                        ), ({value}: {value: string}) => value),
                        onFilter: (value: string, record: Lesson) => record.module.id === value,
                        sorter: (a: Lesson, b: Lesson) => a.name.localeCompare(b.name),
                    },
                    {
                        key: 'pathway',
                        render: (pathway: Pathway) => <a href={`/pathways/${pathway?.id}`}>{pathway?.name}</a>,
                        filters: uniqBy(lessons?.map((lesson: Lesson) => 
                            ({value: lesson.pathway?.id, text: lesson.pathway?.name})
                        ), ({value}: {value: string}) => value),
                        onFilter: (value: string, record: Lesson) => record?.pathway?.id === value,
                        sorter: (a: Lesson, b: Lesson) => a.name.localeCompare(b.name),
                    },
                    {
                        key: 'actions',
                        render: (actions: ActionsType, record: Lesson) => <Actions
                            to={`/lessons/${record.id}`}
                            downloadTitle={actions.downloadTitle}
                            cloudTitle={actions.cloudTitle}
                            deleteTitle={actions.deleteTitle}
                        />
                    }
                ]}
                datas={lessons}
                name="lessons" />
    }
    </Layout>
}