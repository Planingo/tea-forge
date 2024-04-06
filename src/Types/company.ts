import { Actions } from "./actions.js"

export type Company = {
  id: string
  name: string
  tags: string[]
  actions: Actions
  link: string
  alt: string
  photo: string
}
