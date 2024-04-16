import { Pathway_Lesson } from "./pathway_lesson.js"
import { Sub_Pathways_Children } from "./sub_pathways_children.js"
export type Pathway_Parent = {
  id: string
  name: string
  pathway_lessons: Pathway_Lesson[]
  sub_pathways_children: Sub_Pathways_Children[]
}
