import { Student_Company } from "./student_company.js"

export type Company = {
  id: string
  archived?: boolean
  created_at?: Date
  updated_at: Date
  student_companies: Student_Company[]
  name: string
}
