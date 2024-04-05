import { Gallery, GalleryList, Roles, CalendarOutlined, StudentForm, Header, UserOutlined } from '@planingo/ditto';
import { useState } from 'react';
import { Layout } from '../Layout/Layout.js';
import { useAddOneCalendar, useCountCalendar, useSearchCalendars } from '../../Tools/Authenticated/calendars.js';

export const Calendars = () => {
    const { search, calendars, loading: loadingCalendars } = useSearchCalendars()
	const [addOneCalendar, loading] = useAddOneCalendar()
    const [isGrid, setIsGrid] = useState(false)
    const { count } = useCountCalendar()
    return <Layout>
        <Header
            placeholder="Rechercher"
            onSearch={search}
            isRefinementList={true}
            refinementList={{
                FirstActionIcon: UserOutlined,
                firstActionText: 'app.add.calendar',
                FirstForm: <StudentForm onSubmit={addOneCalendar} />,
                firstActioning: loading,
                onFirstAction: addOneCalendar,
                isGrid: isGrid,
                setIsGrid: () => setIsGrid(!isGrid),
                formId: "calendar-form",
            }}
        />
        {isGrid ?
            <Gallery
                datas={calendars}
                name="calendars"
                loading={loadingCalendars}
                count={count}
            />
        : <></>
        // <GalleryList
        //         columns={[
        //             {
        //                 dataIndex: 'src',
        //                 key: 'src',
        //                 render: (src: string) => 
        //                     (<img
        //                         src={src}
        //                         alt="placeholder"
        //                     />),
        //                 title: 'Photo'
        //             },
        //             {
        //                 dataIndex: 'email',
        //                 key: 'email',
        //                 title: 'email'
        //             },
        //             {
        //                 dataIndex: 'firstname',
        //                 key: 'firstname',
        //                 title: 'firstname'
        //             },
        //             {
        //                 dataIndex: 'lastname',
        //                 key: 'lastname',
        //                 title: 'lastname'
        //             },
        //             {
        //                 dataIndex: 'calendar',
        //                 key: 'calendar',
        //                 title: 'calendar',
        //                 render: (calendar: Calendar) => <a href={`/calendars/${calendar?.id}`}>{calendar?.name}</a>
        //             },
        //             {
        //                 dataIndex: 'actions',
        //                 key: 'actions',
        //                 title: 'actions',
        //                 render: (actions: any, record: any) => <div className='actions'>
        //                         <Link to={`/calendars/${record.id}`} replace={true}>
        //                             <Tooltip title={'Détail'} placement='bottom'>
        //                                 <ExportOutlined className='download' />
        //                             </Tooltip>
        //                         </Link>
        //                     <Tooltip title={actions.downloadTitle || 'Télécharger'} placement='bottom'>
        //                         <DownloadOutlined className='download' />
        //                     </Tooltip>
        //                     <Tooltip title={actions.cloudTitle || 'Envoyer'} placement='bottom'>
        //                         <CloudUploadOutlined className='cloud' />
        //                     </Tooltip>
        //                     <Tooltip title={actions.deleteTitle || 'Supprimer'} placement='bottom'>
        //                         <DeleteOutlined className='delete' />
        //                     </Tooltip>
        //                 </div>
        //             }
        //         ]}
        //         datas={calendars}
        //         name="calendars"
        //     />
        }
    </Layout>
}