import {
  Actions,
  ArchivedOutlined,
  Filters,
  Gallery,
  GalleryList,
  Header,
  RoomForm,
  ShopOutlined,
  Tooltip,
} from "@pixel-brew/bubble-craft"
import { useState } from "react"
import { useAddOneRoom, useArchivedById, useSearchRooms } from "../../Tools/Authenticated/rooms.js"
import { Actions as ActionsType } from "../../Types/actions.js"
import { Room } from "../../Types/room.js"
import { Layout } from "../Layout/Layout.js"

export const Rooms = () => {
  const { onSearch, rooms, loading: loadingRooms, filterByArchived } = useSearchRooms()
  const [archivedOneRoom] = useArchivedById()
  const [addOneRoom, loading] = useAddOneRoom()
  const [isGrid, setIsGrid] = useState(false)
  return (
    <Layout>
      <Header
        placeholder="search"
        onSearch={onSearch}
        isRefinementList={true}
        refinementList={{
          FirstActionIcon: ShopOutlined,
          firstActionText: "app.add.room",
          FirstForm: <RoomForm onSubmit={addOneRoom} />,
          firstActioning: loading,
          onFirstAction: addOneRoom,
          isGrid: isGrid,
          setIsGrid: () => setIsGrid(!isGrid),
          formId: "room-form",
        }}
      />
      <Filters
        selects={[
          {
            placeholder: "archived",
            defaultValue: "non archivé",
            options: [
              { value: "all", label: "tous" },
              { value: true, label: "archivé" },
              { value: false, label: "non archivé" },
            ],
            allowClear: false,
            onChange: (isArchived: string | boolean) => filterByArchived(isArchived),
          },
        ]}
        count={{ id: "roomCount", count: rooms?.length }}
      />
      {isGrid ? (
        <Gallery datas={rooms} loading={loadingRooms} name="rooms" />
      ) : (
        <GalleryList
          columns={[
            {
              key: "archived",
              width: "2em",
              render: (archived: boolean) => (
                <>
                  {archived ? (
                    <Tooltip title="archived" placement="bottom">
                      <ArchivedOutlined className="cloud" />
                    </Tooltip>
                  ) : (
                    <></>
                  )}
                </>
              ),
            },
            {
              key: "photo",
              width: "5em",
              haveLabel: true,
              render: (photo: string) => <img src={photo} alt="placeholder" />,
            },
            { key: "name", haveLabel: true },
            { key: "max_seats", haveLabel: true },
            {
              key: "actions",
              haveLabel: true,
              width: "10em",
              render: (actions: ActionsType, record: Room) => (
                <Actions
                  to={`/rooms/${record.id}`}
                  downloadTitle={actions.downloadTitle}
                  cloudTitle={actions.cloudTitle}
                  deleteTitle={actions.deleteTitle}
                  deleteOnClick={() => archivedOneRoom(record.id)}
                />
              ),
            },
          ]}
          datas={rooms}
          name="rooms"
        />
      )}
    </Layout>
  )
}
