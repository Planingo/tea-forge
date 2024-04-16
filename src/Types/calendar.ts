import { Actions } from "./actions.js"
import { Event } from "./event.js"
import { Module_Calendars } from "./Hasura/module_calendars.js"

export type Calendar = {
  id: string
  lessons: Module_Calendars[]
  name: string
  actions: Actions
  link: string
  events: Event[]
  alt: string
  photo: string
}
