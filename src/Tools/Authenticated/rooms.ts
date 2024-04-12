import { gql, useMutation, useQuery } from "@apollo/client"
import { useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import { Room as HasuraRoom } from "../../Types/Hasura/room.js"
import { Room } from "../../Types/room.js"

const SEARCH_ROOMS = gql`
  query getAllRooms($condition: room_bool_exp!) {
    room(where: { _and: [$condition] }, order_by: { name: asc }) {
      id
      archived
      max_seats
      name
    }
  }
`

const getRoomById = gql`
  query room_by_pk($id: uuid!) {
    room_by_pk(id: $id) {
      id
      archived
      max_seats
      name
    }
  }
`

export const toRoom = (room: HasuraRoom): Room => {
  return {
    id: room?.id,
    name: `${room?.name?.toUpperCase()}`,
    max_seats: room?.max_seats,
    archived: room?.archived,
    tags: [],
    events: [],
    actions: {
      downloadTitle: {
        id: "download.calendar.room",
        values: `${room?.name.toUpperCase()}`,
      },
      cloudTitle: {
        id: "send.calendar.room",
        values: `${room?.name.toUpperCase()}`,
      },
      deleteTitle: {
        id: "archived.room",
        values: `${room?.name.toUpperCase()}`,
      },
    },
    link: `/rooms/${room?.id}`,
    alt: `${room?.name?.toUpperCase()}`,
    photo: `https://avatars.bugsyaya.dev/150/${room?.id}`,
  }
}

export const toRooms = (rooms: HasuraRoom[]): Room[] => {
  return rooms?.map((room) => toRoom(room))
}

export const useSearchRooms = () => {
  const [searchQuery, setSearchQuery] = useState<any>({
    variables: {
      condition: { archived: { _eq: false } },
    },
  })

  const { data, ...result } = useQuery(SEARCH_ROOMS, searchQuery)

  const onSearch = useDebouncedCallback((searchText?: string) => {
    setSearchQuery({
      variables: {
        condition: {
          ...searchQuery.variables.condition,
          name: searchText ? { _ilike: `%${searchText}%` } : undefined,
        },
      },
    })
  }, 500)

  const filterByArchived = (archived: string | boolean) => {
    setSearchQuery({
      variables: {
        condition: {
          ...searchQuery.variables.condition,
          archived: { _eq: archived === "all" ? undefined : archived },
        },
      },
    })
  }

  const rooms = toRooms(data?.room)?.filter((room) =>
    searchQuery?.variables?.condition?.archived?._eq !== undefined
      ? room?.archived === searchQuery?.variables?.condition?.archived?._eq
      : room
  )

  return {
    onSearch,
    rooms,
    filterByArchived,
    ...result,
  }
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
      refetchQueries: ["getAllRooms"],
    }
  )

  return [
    (room: HasuraRoom) => {
      return addOneRoom({ variables: room })
    },
    result,
  ]
}

export const useArchivedById = () => {
  const [archivedOneRoom, result] = useMutation(
    gql`
      mutation archivedOneRoom($id: uuid!) {
        update_room_by_pk(pk_columns: { id: $id }, _set: { archived: true }) {
          id
          archived
          updated_at
          created_at
        }
      }
    `,
    {
      refetchQueries: ["getAllRooms"],
    }
  )

  return [
    (id: string) => {
      return archivedOneRoom({ variables: { id: id } })
    },
    result,
  ] as const
}

export const useGetRoomById = (id: string) => {
  const { data, ...result } = useQuery(getRoomById, {
    variables: { id: id },
  })

  const r = toRoom(data?.room_by_pk)
  return { room: r, ...result }
}
