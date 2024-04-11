import { Actions } from "./actions.js"

export type Professor = {
  id: string
  name: string
  firstname: string
  archived: boolean
  lastname: string
  email: string
  tags: string[]
  actions: Actions
  link: string
  alt: string
  photo: string
}
