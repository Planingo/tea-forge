import { Actions } from "./actions.js"

export type Module = {
  id: string
  name: string
  pathways: { id: string; name: string }[]
  tags: string[]
  actions: Actions
  link: string
  alt: string
  photo: string
}
