import { Actions } from "./actions.js"
import { Event } from "./event.js"
import { Pathway } from "./pathway.js"

export type Calendar = {
  id: string
  pathway: Pathway
  archived: boolean
  name: string
  actions: Actions
  link: string
  events: Event[]
  alt: string
  photo: string
}
