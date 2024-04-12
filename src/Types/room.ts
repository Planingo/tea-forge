import { Actions } from "./actions.js"
import { Event } from "./event.js"

export type Room = {
  id: string
  name: string
  archived?: boolean
  max_seats: number
  tags: string[]
  events: Event[]
  actions: Actions
  link: string
  alt: string
  photo: string
}
