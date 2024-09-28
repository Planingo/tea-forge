import { Actions } from "./actions.js"
import { Calendar } from "./calendar.js"
import { Event } from "./event.js"

export type Pathway = {
  id: string
  name: string
  archived?: boolean
  tags: string[]
  calendars: Calendar[]
  parent_pathway: Pathway
  children_pathway: Pathway[]
  actions: Actions
  link: string
  alt: string
  photo: string
  events: Event[]
  student_number: number
}
