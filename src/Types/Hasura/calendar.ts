import { Calendar_Lessons } from "./calendar_lessons.js"
import { Module_Calendars } from "./module_calendars.js"
import { Pathway_Calendars } from "./pathway_calendars.js"
import { Student_Calendar } from "./student_calendar.js"

export type Calendar = {
  id: string
  name: string
  created_at: Date
  updated_at: Date
  archived: boolean
  pathway_calendars: Pathway_Calendars[]
  calendar_lessons: Calendar_Lessons[]
  student_calendars: Student_Calendar[]
  module_calendars: Module_Calendars[]
}
