import { Calendar } from "./calendar.js"
import { Student } from "./student.js"

export type Student_Calendar = {
  id: string
  calendar: Calendar
  archived: boolean
  created_at: Date
  updated_at: Date
  student_id: string
  calendar_id: string
  student: Student
}
