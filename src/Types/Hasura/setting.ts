import { Setting_Navigation } from "./setting_navigation.js"
import { Setting_Weeks } from "./setting_weeks.js"

export type Setting = {
  id: string
  setting_navigations: Setting_Navigation[]
  setting_weeks: Setting_Weeks[]
}
