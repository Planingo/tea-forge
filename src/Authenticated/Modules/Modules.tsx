import { 
    GalleryList,
    Gallery,
    ModuleForm,
    TagsOutlined,
    Tooltip,
    DownloadOutlined,
    CloudUploadOutlined,
    DeleteOutlined,
    ExportOutlined,
    Header,
    Spin
} from '@planingo/ditto';
import { useState } from 'react';
import { useAddOneModule, useModules_tea } from '../../Tools/Authenticated/modules.js';
import { Link } from 'react-router-dom';
import { Layout } from '../Layout/Layout.js';
import { Pathway } from '../../Types/pathway.js';

export const Modules = () => {
    const onSearch = (e: any) => {
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
                        dataIndex: 'pathways',
                        key: 'pathways',
                        title: 'pathways',
                        render: (pathways: Pathway[]) => pathways?.map(pathway => <a href={`/pathways/${pathway.id}`}>{pathway.name}</a>),
                    },
                    {
                        dataIndex: 'actions',
                        key: 'actions',
                        title: 'actions',
                        render: (actions: any, record: any) => <div className='actions'>
                                <Link to={`/modules/${record.id}`} replace={true}>
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
                datas={modules}
                name="modules" />
    }
    </Layout>
}