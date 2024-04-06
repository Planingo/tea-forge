import { Actions } from "./actions.js"
import { Event } from "./event.js"

export type Lesson = {
  id: string
  name: string
  start_date: string
  end_date: string
  module: { id: string; name: string }
  pathway: { id: string; name: string }
  events: Event[]
  tags: string[]
  actions: Actions
  link: string
  alt: string
  photo: string
}
