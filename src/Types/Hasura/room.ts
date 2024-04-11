export type Room = {
  id: string
  archived?: boolean
  created_at?: Date
  updated_at: Date
  name: string
  max_seats: number
}
