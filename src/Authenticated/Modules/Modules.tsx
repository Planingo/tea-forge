import { 
    GalleryList,
    Gallery,
    ModuleForm,
    TagsOutlined,
    Actions,
    Header,
    Spin
} from '@planingo/ditto';
import { useState } from 'react';
import { useAddOneModule, useModules_tea } from '../../Tools/Authenticated/modules.js';
import { Layout } from '../Layout/Layout.js';
import { Pathway } from '../../Types/pathway.js';
import { Module } from '../../Types/module.js';
import { Actions as ActionsType } from '../../Types/actions.js';

export const Modules = () => {
    const onSearch = (e: string) => {
        console.log
    } 
    const {modules, loading: loadingModules} = useModules_tea()
	const [addOneModule, loading] = useAddOneModule()
    const [isGrid, setIsGrid] = useState(false)
    return <Layout>
    <Header 
        placeholder="Rechercher"
        onSearch={onSearch}
        isRefinementList={true}
        refinementList={{
            FirstActionIcon: TagsOutlined,
            firstActionText: 'app.add.module',
            FirstForm: <ModuleForm onSubmit={addOneModule} />,
            firstActioning: loading,
            onFirstAction: addOneModule,
            isGrid: isGrid,
            setIsGrid: () => setIsGrid(!isGrid),
            formId: "module-form",
        }}
        refinementDetails ={{
            FirstActionIcon: TagsOutlined,
            firstActionText: 'app.add.module',
            FirstForm: <ModuleForm onSubmit={addOneModule} />,
            firstActioning: loading,
            onFirstAction: addOneModule,
            isGrid: isGrid,
            setIsGrid: () => setIsGrid(isGrid),
            formId: "module-form",
            SecondActionIcon: console.log,
            SecondForm: <></>,
            onSecondAction: console.log,
            secondActionText: 'app.edit.module',
            secondActioning: console.log,
        }}
    />
    {loadingModules ? <Spin /> :
        isGrid ?
            <Gallery
                datas={modules}
                name="modules"
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
                        sorter: (a: Module, b: Module) => a.name.localeCompare(b.name),
                    },
                    {
                        key: 'pathways',
                        render: (pathways: Pathway[]) => pathways?.map(pathway => <a href={`/pathways/${pathway.id}`}>{pathway.name}</a>),
                    },
                    {
                        key: 'actions',
                        render: (actions: ActionsType, record: Module) => <Actions
                            to={`/modules/${record.id}`}
                            downloadTitle={actions.downloadTitle}
                            cloudTitle={actions.cloudTitle}
                            deleteTitle={actions.deleteTitle}
                        />
                    }
                ]}
                datas={modules}
                name="modules" />
    }
    </Layout>
}