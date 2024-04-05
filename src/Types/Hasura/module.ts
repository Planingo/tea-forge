import { Module_Calendars } from './module_calendars.js';
import { Module_Lesson } from './module_lesson.js';
import { Pathway_Module } from './pathway_module.js';

export type Module = {
    id: string
    archived?: Boolean
    created_at?: Date
    updated_at: Date
    name: string
    module_lessons: Module_Lesson[] 
    pathway_modules: Pathway_Module[]
    module_calendars: Module_Calendars[]
}