import { UUID } from "crypto"
import { Module } from "./module.js"

export type Lesson = {
    id: UUID
    archived?: Boolean
    created_at?: Date
    updated_at: Date
    name: string
    start_date: Date
    end_date: Date
    module: Module
}