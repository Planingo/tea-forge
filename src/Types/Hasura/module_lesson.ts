import { Lesson } from "./lesson.js"
import { Module } from "./module.js"

export type Module_Lesson = {
  id: string
  archived?: boolean
  created_at?: Date
  updated_at: Date
  module: Module
  lesson: Lesson
  module_id: string
  lesson_id: string
}
