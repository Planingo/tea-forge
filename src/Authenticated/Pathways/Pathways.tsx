import { 
    GalleryList,
    Gallery,
    PathwayForm,
    ExperimentOutlined,
    Tooltip,
    DownloadOutlined,
    CloudUploadOutlined,
    DeleteOutlined,
    ExportOutlined,
    Header,
    Spin
} from '@planingo/ditto';
import { useState } from 'react';
import { useAddOnePathway, usePathways_tea } from '../../Tools/Authenticated/pathways.js';
import { Link } from 'react-router-dom';
import { Layout } from '../Layout/Layout.js';

export const Pathways = () => {
    const onSearch = (e: any) => {
        console.log
    } 
    const {pathways, loading: loadingPathways} = usePathways_tea()
	const [addOnePathway, loading] = useAddOnePathway()
    const [isGrid, setIsGrid] = useState(true)
    return <Layout>
    <Header 
        placeholder="Rechercher"
        onSearch={onSearch}
        isRefinementList={true}
        refinementList={{
            FirstActionIcon: ExperimentOutlined,
            firstActionText: 'app.add.pathway',
            FirstForm: <PathwayForm onSubmit={addOnePathway} />,
            firstActioning: loading,
            onFirstAction: addOnePathway,
            isGrid: isGrid,
            setIsGrid: () => setIsGrid(!isGrid),
            formId: "pathway-form",
        }}
        refinementDetails ={{
            FirstActionIcon: ExperimentOutlined,
            firstActionText: 'app.add.pathway',
            FirstForm: <PathwayForm onSubmit={addOnePathway} />,
            firstActioning: loading,
            onFirstAction: addOnePathway,
            isGrid: isGrid,
            setIsGrid: () => setIsGrid(isGrid),
            formId: "pathway-form",
            SecondActionIcon: console.log,
            SecondForm: <></>,
            onSecondAction: console.log,
            secondActionText: 'app.edit.pathway',
            secondActioning: console.log,
        }}
    />
    {loadingPathways ? <Spin /> :
        isGrid ?
            <Gallery
                datas={pathways}
                name="pathway"
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
                                <Link to={`/pathways/${record.id}`} replace={true}>
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
                datas={pathways}
                name="pathway" />
    }
    </Layout>
}