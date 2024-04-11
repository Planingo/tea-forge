import { Actions } from "./actions.js"
import { Calendar } from "./calendar.js"
import { Company } from "./company.js"
import { Event } from "./event.js"
import { Pathway } from "./pathway.js"

export type Student = {
  id: string
  name: string
  archived?: boolean
  firstname: string
  lastname: string
  email: string
  pathways: Pathway[]
  calendars: Calendar[]
  companies: Company[]
  events: Event[]
  tags: string[]
  actions: Actions
  link: string
  alt: string
  photo: string
}
