import { Actions } from "./actions.js"

export type Pathway = {
    id: string
    name: string
    tags: string[],
    actions: Actions
    link: string
    alt: string
    photo: string
}
