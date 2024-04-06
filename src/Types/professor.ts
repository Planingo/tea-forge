import { Actions } from "./actions.js"

export type Professor = {
  id: string
  name: string
  firstname: string
  lastname: string
  email: string
  tags: string[]
  actions: Actions
  link: string
  alt: string
  photo: string
}
