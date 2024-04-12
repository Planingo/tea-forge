import { Actions } from "./actions.js"
import { Calendar } from "./calendar.js"
import { Event } from "./event.js"
import { Pathway } from "./pathway.js"

export type Module = {
  id: string
  name: string
  archived?: boolean
  pathways: Pathway[]
  calendars: Calendar[]
  events: Event[]
  tags: string[]
  actions: Actions
  link: string
  alt: string
  photo: string
}
