import { gql, useMutation, useQuery } from "@apollo/client"
import { Room as HasuraRoom } from "../../Types/Hasura/room.js"
import { Room } from "../../Types/room.js"

const getRoomsQuerie = gql`
  query rooms {
    room(order_by: { name: asc }, where: { archived: { _eq: false } }) {
      id
      max_seats
      name
    }
  }
`

export const useRooms = () => {
  const { data, ...result } = useQuery(getRoomsQuerie)
  const rooms: Room = data?.room.map((room: HasuraRoom) => ({
    id: room.id,
    name: `${room.name.toUpperCase()}`,
    max_seats: room.max_seats,
    tags: [],
    actions: {
      downloadTitle: `Télécharger le calendrier pour ${room.name.toUpperCase()}`,
      cloudTitle: `Envoyer le calendrier à ${room.name.toUpperCase()}`,
      deleteTitle: `Supprimer l'étudtiant ${room.name.toUpperCase()}`,
    },
    link: `/rooms/${room.id}`,
    alt: `${room.name.toUpperCase()}`,
    photo: `https://avatars.bugsyaya.dev/150/${room.id}`,
  }))
  return { rooms, ...result }
}

export const useAddOneRoom = () => {
  const [addOneRoom, result] = useMutation(
    gql`
      mutation addOneRoom($max_seats: Int, $name: String) {
        insert_room_one(object: { max_seats: $max_seats, name: $name }) {
          id
        }
      }
    `,
    {
      refetchQueries: [
        {
          query: getRoomsQuerie,
        },
      ],
    }
  )

  return [
    (room: HasuraRoom) => {
      return addOneRoom({ variables: room })
    },
    result,
  ]
}
