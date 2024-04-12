import { Pathway_Calendars } from "./pathway_calendars.js"
import { Pathway_Module } from "./pathway_module.js"
import { Student_Pathways } from "./student_pathways.js"

export type Pathway = {
  id: string
  archived?: boolean
  created_at?: Date
  updated_at: Date
  name: string
  pathway_modules: Pathway_Module[]
  student_pathways: Student_Pathways[]
  pathway_calendars: Pathway_Calendars[]
}
