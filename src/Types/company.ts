import { Actions } from "./actions.js"
import { Event } from "./event.js"

export type Company = {
  id: string
  name: string
  tags: string[]
  archived?: boolean
  student_number: number
  actions: Actions
  link: string
  alt: string
  events: Event[]
  photo: string
}
