import { Pathway } from './pathway.js';
import { Module } from './module.js';

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