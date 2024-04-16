import { Pathway_Lesson } from "./pathway_lesson.js"
import { Sub_Pathways_Parent } from "./sub_pathways_parent.js"

export type Pathway_Children = {
  id: string
  name: string
  pathway_lessons: Pathway_Lesson[]
  sub_pathways_parent: Sub_Pathways_Parent[]
}
