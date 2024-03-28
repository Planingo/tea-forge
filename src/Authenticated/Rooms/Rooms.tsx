import { 
    GalleryList,
    Gallery,
    RoomForm,
    ShopOutlined,
    Tooltip,
    DownloadOutlined,
    CloudUploadOutlined,
    DeleteOutlined,
    ExportOutlined,
    Header,
    Spin
} from '@planingo/ditto';
import { useState } from 'react';
import { useAddOneRoom, useRooms } from '../../Tools/Authenticated/rooms.js';
import { Link } from 'react-router-dom';
import { Layout } from '../Layout/Layout.js';

export const Rooms = () => {
    const onSearch = (e: any) => {
        console.log
    } 
    const {rooms, loading: loadingRooms} = useRooms()
	const [addOneRoom, loading] = useAddOneRoom()
    const [isGrid, setIsGrid] = useState(true)
    return <Layout>
    <Header 
        placeholder="Rechercher"
        onSearch={onSearch}
        isRefinementList={true}
        refinementList={{
            FirstActionIcon: ShopOutlined,
            firstActionText: 'app.add.room',
            FirstForm: <RoomForm onSubmit={addOneRoom} />,
            firstActioning: loading,
            onFirstAction: addOneRoom,
            isGrid: isGrid,
            setIsGrid: () => setIsGrid(!isGrid),
            formId: "room-form",
        }}
        refinementDetails ={{
            FirstActionIcon: ShopOutlined,
            firstActionText: 'app.add.room',
            FirstForm: <RoomForm onSubmit={addOneRoom} />,
            firstActioning: loading,
            onFirstAction: addOneRoom,
            isGrid: isGrid,
            setIsGrid: () => setIsGrid(isGrid),
            formId: "room-form",
            SecondActionIcon: console.log,
            SecondForm: <></>,
            onSecondAction: console.log,
            secondActionText: 'app.edit.room',
            secondActioning: console.log,
        }}
    />
    {loadingRooms ? <Spin /> :
        isGrid ?
            <Gallery
                datas={rooms}
                name="room"
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
                        dataIndex: 'max_seats',
                        key: 'max_seats',
                        title: 'Max seats'
                    },
                    {
                        dataIndex: 'actions',
                        key: 'actions',
                        title: 'actions',
                        render: (actions: any, record: any) => <div className='actions'>
                                <Link to={`/rooms/${record.id}`} replace={true}>
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
                datas={rooms}
                name="room" />
    }
    </Layout>
}