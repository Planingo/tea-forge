import { 
    GalleryList,
    Gallery,
    ProfessorForm,
    TeamOutlined,
    Tooltip,
    DownloadOutlined,
    CloudUploadOutlined,
    DeleteOutlined,
    ExportOutlined,
    Header,
    Spin
} from '@planingo/ditto';
import { useState } from 'react';
import { useAddOneProfessor, useProfessors } from '../../Tools/Authenticated/professors.js';
import { Link } from 'react-router-dom';
import { Layout } from '../Layout/Layout.js';
import { Professor } from '../../Types/professor.js';
import { Actions } from '../../Types/actions.js';

export const Professors = () => {
    const onSearch = (e: string) => {
        console.log
    } 
    const {professors, loading: loadingProfessors} = useProfessors()
	const [addOneProfessor, loading] = useAddOneProfessor()
    const [isGrid, setIsGrid] = useState(false)
    return <Layout>
    <Header 
        placeholder="Rechercher"
        onSearch={onSearch}
        isRefinementList={true}
        refinementList={{
            FirstActionIcon: TeamOutlined,
            firstActionText: 'app.add.professor',
            FirstForm: <ProfessorForm onSubmit={addOneProfessor} />,
            firstActioning: loading,
            onFirstAction: addOneProfessor,
            isGrid: isGrid,
            setIsGrid: () => setIsGrid(!isGrid),
            formId: "professor-form",
        }}
        refinementDetails ={{
            FirstActionIcon: TeamOutlined,
            firstActionText: 'app.add.professor',
            FirstForm: <ProfessorForm onSubmit={addOneProfessor} />,
            firstActioning: loading,
            onFirstAction: addOneProfessor,
            isGrid: isGrid,
            setIsGrid: () => setIsGrid(isGrid),
            formId: "professor-form",
            SecondActionIcon: console.log,
            SecondForm: <></>,
            onSecondAction: console.log,
            secondActionText: 'app.edit.professor',
            secondActioning: console.log,
        }}
    />
    {loadingProfessors ? <Spin /> :
        isGrid ?
            <Gallery
                datas={professors}
                name="professors"
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
                        dataIndex: 'lastname',
                        key: 'lastname',
                        title: 'lastname',
                        sorter: (a: Professor, b: Professor) => a.lastname.localeCompare(b.lastname),
                    },
                    {
                        dataIndex: 'firstname',
                        key: 'firstname',
                        title: 'firstname',
                        sorter: (a: Professor, b: Professor) => a.firstname.localeCompare(b.firstname),
                    },
                    {
                        dataIndex: 'email',
                        key: 'email',
                        title: 'email'
                    },
                    {
                        dataIndex: 'actions',
                        key: 'actions',
                        title: 'actions',
                        render: (actions: Actions, record: Professor) => <div className='actions'>
                                <Link to={`/professors/${record.id}`} replace={true}>
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
                datas={professors}
                name="professors" />
    }
    </Layout>
}