import { Actions } from "./actions.js"
import { Event } from './event.js';

export type Student = {
    id: string
        name: string
        firstname: string
        lastname: string
        email: string
        pathway: {id: string, name: string}
        calendar: {id: string, name: string}
        events: Event[]
        tags: string[],
        actions : Actions
        link: string
        alt: string
        src: string
}
