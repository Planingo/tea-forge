import { Navigation } from "./navigation.js"
import { Week } from "./week.js"

export type Account = {
  id: string
  email: string
  lastname: string
  firstname: string
  name: string
  navigation: Navigation[]
  week: Week[]
}
