import { gql, useQuery } from "@apollo/client"
import { Account } from "../../Types/account.js"
import { Account as AccountHasura } from "../../Types/Hasura/account.js"
import { Account_Settings } from "../../Types/Hasura/account_settings.js"
import { Setting_Navigation } from "../../Types/Hasura/setting_navigation.js"
import { Setting_Weeks } from "../../Types/Hasura/setting_weeks.js"

const getAccountById = gql`
  query account_by_pk($id: uuid!) {
    account_by_pk(id: $id) {
      id
      email
      user {
        id
        firstname
        lastname
      }
      account_roles {
        id
        role {
          id
          name
        }
      }
      account_settings {
        id
        setting {
          id
          setting_navigations {
            id
            navigation {
              id
              lesson
              company
              module
              pathway
              professor
              room
            }
          }
          setting_weeks {
            id
            week {
              id
              monday_start
              monday_end
              friday_end
              friday_start
              saturday_end
              saturday_start
              sunday_end
              sunday_start
              thursday_end
              thursday_start
              tuesday_end
              tuesday_start
              wednesday_end
              wednesday_start
            }
          }
        }
      }
    }
  }
`

const toAccount = (account: AccountHasura): Account => {
  return {
    id: account?.id,
    email: account?.email,
    firstname: account?.user?.firstname,
    lastname: account?.user?.lastname?.toUpperCase(),
    name: `${account?.user?.lastname?.toUpperCase()} ${account?.user?.firstname}`,
    navigation: account?.account_settings?.flatMap((accountSetting: Account_Settings) =>
      accountSetting.setting.setting_navigations.map(
        (settingNavigation: Setting_Navigation) => settingNavigation.navigation
      )
    ),
    week: account?.account_settings?.flatMap((accountSettings: Account_Settings) =>
      accountSettings.setting.setting_weeks.map((settingWeek: Setting_Weeks) => settingWeek.week)
    ),
  }
}

export const useGetAccountById = (id: string) => {
  const { data, ...result } = useQuery(getAccountById, {
    variables: { id: id },
  })

  const a = toAccount(data?.account_by_pk)
  console.log(a)
  return { account: a, ...result }
}
