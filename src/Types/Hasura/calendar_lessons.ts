import { Calendar } from "./calendar.js"
import { Lesson } from "./lesson.js"

export type Calendar_Lessons = {
  id: string
  lesson: Lesson
  archived: boolean
  created_at: Date
  updated_at: Date
  calendar_id: string
  lesson_id: string
  calendar: Calendar
}
