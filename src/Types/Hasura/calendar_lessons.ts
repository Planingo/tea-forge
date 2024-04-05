import { Lesson } from './lesson.js';
import { Calendar } from './calendar.js';

export type Calendar_Lessons = {
    id: string
    lesson: Lesson
    archived: boolean
    created_at: Date
    updated_at: Date
    calendar_id: string
    lesson_id: string
    calendar: Calendar
}