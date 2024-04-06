import { 
    GalleryList,
    Gallery,
    RoomForm,
    ShopOutlined,
    Actions,
    Header,
    Spin
} from '@planingo/ditto';
import { useState } from 'react';
import { useAddOneRoom, useRooms } from '../../Tools/Authenticated/rooms.js';
import { Layout } from '../Layout/Layout.js';
import { Actions as ActionsType } from '../../Types/actions.js';
import { Room } from '../../Types/room.js';

export const Rooms = () => {
    const onSearch = (e: string) => {
        console.log
    } 
    const {rooms, loading: loadingRooms} = useRooms()
	const [addOneRoom, loading] = useAddOneRoom()
    const [isGrid, setIsGrid] = useState(false)
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
                name="rooms"
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
                    { key: 'name' },
                    { key: 'max_seats' },
                    {
                        key: 'actions',
                        render: (actions: ActionsType, record: Room) => <Actions
                            to={`/rooms/${record.id}`}
                            downloadTitle={actions.downloadTitle}
                            cloudTitle={actions.cloudTitle}
                            deleteTitle={actions.deleteTitle}
                        />
                    }
                ]}
                datas={rooms}
                name="rooms" />
    }
    </Layout>
}