import { Header, RoomForm, UserOutlined } from "@pixel-brew/bubble-craft"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useSearchPathways } from "../../Tools/Authenticated/pathways.js"
import { useAddOneRoom, useGetRoomById } from "../../Tools/Authenticated/rooms.js"
import { Details } from "../Layout/Details.js"
import { Layout } from "../Layout/Layout.js"

export const Room = () => {
  const { id } = useParams()
  const { room, loading: loadingRoom } = useGetRoomById(id!)
  const navigate = useNavigate()
  const [addOneRoom, loading] = useAddOneRoom()
  const [isGrid, setIsGrid] = useState(false)
  const { pathways } = useSearchPathways()

  if (loadingRoom) return

  return (
    <Layout>
      <Header
        placeholder="search"
        isRefinementList={false}
        refinementDetails={{
          FirstActionIcon: UserOutlined,
          firstActionText: "app.add.room",
          FirstForm: <RoomForm onSubmit={addOneRoom} pathways={pathways} />,
          firstActioning: loading,
          onFirstAction: addOneRoom,
          isGrid: isGrid,
          setIsGrid: () => setIsGrid(!isGrid),
          formId: "room-form",
          backTo: () => navigate("/rooms"),
          SecondActionIcon: UserOutlined,
          secondActionText: "app.edit.room",
          SecondForm: <></>,
          secondActioning: loading,
          onSecondAction: addOneRoom,
          Info: (
            <div className="infos">
              <img src={room?.photo} alt={room?.alt} />
              <div className="info">
                <p>{room?.name?.toUpperCase()}</p>
              </div>
            </div>
          ),
        }}
      />
      <Details entityName={room?.name} events={room?.events} />
    </Layout>
  )
}
