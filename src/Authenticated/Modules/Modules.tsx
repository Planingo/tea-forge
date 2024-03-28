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

export const Modules = () => {
    const onSearch = (e: any) => {
        console.log
    } 
    const {modules, loading: loadingModules} = useModules_tea()
	const [addOneModule, loading] = useAddOneModule()
    const [isGrid, setIsGrid] = useState(true)
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
                name="module"
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
                        dataIndex: 'actions',
                        key: 'actions',
                        title: 'actions',
                        render: (actions: any) => <div className='actions'>
                                <Link to={`/modules/1`} replace={true}>
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
                name="module" />
    }
    </Layout>
}