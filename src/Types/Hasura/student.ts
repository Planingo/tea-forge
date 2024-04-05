import { Student_Calendar } from "./student_calendar.js"
import { Student_Pathways } from "./student_pathways.js"
import { User } from "./user.js"

export type Student = {
    id: string
    archived?: Boolean
    created_at?: Date
    updated_at: Date
    user_id: string
    user: User
    student_pathways: Student_Pathways[]
    student_calendars: Student_Calendar[]
}