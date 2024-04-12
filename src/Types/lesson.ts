import { Actions } from "./actions.js"
import { Event } from "./event.js"
import { Module } from "./module.js"
import { Pathway } from "./pathway.js"

export type Lesson = {
  id: string
  name: string
  start_date: string
  archived?: boolean
  end_date: string
  modules: Module[]
  pathways: Pathway[]
  events: Event[]
  tags: string[]
  actions: Actions
  link: string
  alt: string
  photo: string
}
