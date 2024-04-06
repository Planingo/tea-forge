import { Module } from "./module.js"
import { Pathway } from "./pathway.js"

export type Pathway_Module = {
  id: string
  archived: boolean
  created_at: Date
  updated_at: Date
  pathway: Pathway
  pathway_id: string
  module_id: string
  module: Module
}
