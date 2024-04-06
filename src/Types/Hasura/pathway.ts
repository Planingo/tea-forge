import { Pathway_Module } from "./pathway_module.js"
import { Student_Pathways } from "./student_pathways.js"

export type Pathway = {
  id: string
  archived?: Boolean
  created_at?: Date
  updated_at: Date
  name: string
  pathway_modules: Pathway_Module[]
  student_pathways: Student_Pathways[]
}
