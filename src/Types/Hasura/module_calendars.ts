import { Module } from './module.js';
import { Calendar } from './calendar.js';

export type Module_Calendars = {
    id: string
    module: Module
    archived: boolean
    created_at: Date
    updated_at: Date
    module_id: string
    calendar_id: string
    calendar: Calendar
}