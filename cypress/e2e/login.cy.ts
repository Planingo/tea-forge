describe("Login", () => {
  it("connect", () => {
    cy.visit(`${Cypress.env("baseUrl")}`)
    cy.url().should("contain", "/login")
    cy.get(".ant-form-item-control-input-content > .ant-input").type("lise.fouet@pixel-brew.com")
    cy.get(".ant-input-affix-wrapper > .ant-input").type("Super mon 2 passe !")
    cy.get(".ant-btn").click()
    cy.url().should("eq", `${Cypress.env("baseUrl")}/`)
  })

  it("click to signup", () => {
    cy.visit(`${Cypress.env("baseUrl")}`)
    cy.get("[href='/signup']").click()
    cy.url().should("eq", `${Cypress.env("baseUrl")}/signup`)
  })

  it("click to reset", () => {
    cy.visit(`${Cypress.env("baseUrl")}`)
    cy.get("[href='/reset']").click()
    cy.url().should("eq", `${Cypress.env("baseUrl")}/reset`)
  })
})
