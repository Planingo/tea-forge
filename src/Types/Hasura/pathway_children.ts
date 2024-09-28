import { Pathway_Calendars } from "./pathway_calendars.js"
import { Pathway_Lesson } from "./pathway_lesson.js"
import { Student_Pathways } from "./student_pathways.js"
import { Sub_Pathways_Children } from "./sub_pathways_children.js"
import { Sub_Pathways_Parent } from "./sub_pathways_parent.js"

export type Pathway_Children = {
  id: string
  archived?: boolean
  created_at?: Date
  updated_at: Date
  name: string
  pathway_lessons: Pathway_Lesson[]
  sub_pathways_parent: Sub_Pathways_Parent[]
  sub_pathways_children: Sub_Pathways_Children[]
  pathway_calendars: Pathway_Calendars[]
  student_pathways: Student_Pathways[]
}
