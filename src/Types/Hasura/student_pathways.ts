import { Pathway } from "./pathway.js"
import { Student } from "./student.js"

export type Student_Pathways = {
  id: string
  archived?: boolean
  created_at?: Date
  updated_at?: Date
  pathway_id?: string
  pathway: Pathway
  student_id?: string
  student: Student
}
