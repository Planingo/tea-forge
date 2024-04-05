import { Module } from "./module.js"
import { Lesson } from "./lesson.js"

export type Module_Lesson = {
    id: string
    archived?: Boolean
    created_at?: Date
    updated_at: Date
    module: Module
    lesson: Lesson
    module_id: string
    lesson_id: string
}