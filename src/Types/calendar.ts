import { Actions } from "./actions.js"
import { Module_Calendars } from "./Hasura/module_calendars.js"

export type Calendar = {
    id: string
    lessons: Module_Calendars[]
    name: string
    actions : Actions
    link: string
    alt: string
    photo: string
}