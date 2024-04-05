import { 
    GalleryList,
    Gallery,
    CompanyForm,
    CompanyOutlined,
    Tooltip,
    DownloadOutlined,
    CloudUploadOutlined,
    DeleteOutlined,
    ExportOutlined,
    Header,
    Spin
} from '@planingo/ditto';
import { useState } from 'react';
import { useAddOneCompany, useCompanies } from '../../Tools/Authenticated/companies.js';
import { Link } from 'react-router-dom';
import { Layout } from '../Layout/Layout.js';
import { Actions } from '../../Types/actions.js';
import { Company } from '../../Types/company.js';

export const Companies = () => {
    const onSearch = (e: string) => {
        console.log
    } 
    const {companies, loading: loadingCompanies} = useCompanies()
	const [addOneCompany, loading] = useAddOneCompany()
    const [isGrid, setIsGrid] = useState(false)
    return <Layout>
    <Header 
        placeholder="Rechercher"
        onSearch={onSearch}
        isRefinementList={true}
        refinementList={{
            FirstActionIcon: CompanyOutlined,
            firstActionText: 'app.add.company',
            FirstForm: <CompanyForm onSubmit={addOneCompany} />,
            firstActioning: loading,
            onFirstAction: addOneCompany,
            isGrid: isGrid,
            setIsGrid: () => setIsGrid(!isGrid),
            formId: "company-form",
        }}
        refinementDetails ={{
            FirstActionIcon: CompanyOutlined,
            firstActionText: 'app.add.company',
            FirstForm: <CompanyForm onSubmit={addOneCompany} />,
            firstActioning: loading,
            onFirstAction: addOneCompany,
            isGrid: isGrid,
            setIsGrid: () => setIsGrid(isGrid),
            formId: "company-form",
            SecondActionIcon: console.log,
            SecondForm: <></>,
            onSecondAction: console.log,
            secondActionText: 'app.edit.company',
            secondActioning: console.log,
        }}
    />
    {loadingCompanies ? <Spin /> :
        isGrid ?
            <Gallery
                datas={companies}
                name="companies"
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
                        render: (actions: Actions, record: Company) => <div className='actions'>
                                <Link to={`/companies/${record.id}`} replace={true}>
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
                datas={companies}
                name="companies" />
    }
    </Layout>
}