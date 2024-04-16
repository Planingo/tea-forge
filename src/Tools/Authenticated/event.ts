import { generateColor } from "../../../helper/generate_colors.js"
import { Event } from "../../Types/event.js"
import { Lesson as HasuraLesson } from "../../Types/Hasura/lesson.js"
import { Module as HasuraModule } from "../../Types/Hasura/module.js"

export const toEvent = (lesson: HasuraLesson, module?: HasuraModule): Event => {
  return {
    title: lesson?.name,
    start: lesson?.start_date,
    end: lesson?.end_date,
    backgroundColor: generateColor(
      module?.name ||
        (lesson?.module_lessons?.length > 0 &&
          lesson?.module_lessons?.map((module_lesson) => module_lesson?.module?.name)[0]) ||
        "null"
    ),
    borderColor: generateColor(
      module?.name ||
        (lesson?.module_lessons?.length > 0 &&
          lesson?.module_lessons?.map((module_lesson) => module_lesson?.module?.name)[0]) ||
        "null"
    ),
  }
}

export const toEvents = (lessons: HasuraLesson[]): Event[] => {
  return lessons?.map((lesson) => toEvent(lesson))
}
