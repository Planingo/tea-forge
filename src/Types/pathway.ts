import { Actions } from "./actions.js"

export type Pathway = {
  id: string
  name: string
  archived?: boolean
  tags: string[]
  actions: Actions
  link: string
  alt: string
  photo: string
}
