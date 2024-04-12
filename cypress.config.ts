import { defineConfig } from "cypress"

export default defineConfig({
  env: {
    baseUrl: "http://192.168.1.46:5173",
  },
  e2e: {
    setupNodeEvents(on, config) {},
  },
})
