import { Actions } from "./actions.js"

export type Room = {
    id: string
    name: string
    max_seats: number
    tags: string[]
    actions: Actions
    link: string
    alt: string
    photo: string
}
