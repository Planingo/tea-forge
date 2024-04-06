import { Calendar_Lessons } from "./calendar_lessons.js"
import { Module_Lesson } from "./module_lesson.js"

export type Lesson = {
  id: string
  archived?: Boolean
  created_at?: Date
  updated_at: Date
  name: string
  start_date: Date
  end_date: Date
  module_lessons: Module_Lesson[]
  calendar_lessons: Calendar_Lessons[]
}
