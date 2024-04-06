describe("Signup", () => {
  it("create account", () => {
    cy.visit(`${Cypress.env("baseUrl")}/signup`)
    cy.url().should("contain", "/signup")
    cy.get(".ant-form-item-control-input-content > .ant-input").type("lise.fouet@pixel-brew.com")
    cy.get(".ant-input-affix-wrapper > .ant-input").type("Super mon 2 passe !")
    cy.get(".ant-btn").click()
    cy.url().should("eq", `${Cypress.env("baseUrl")}/`)
  })

  it("click to login", () => {
    cy.visit(`${Cypress.env("baseUrl")}/signup`)
    cy.get("[href='/login']").click()
    cy.url().should("eq", `${Cypress.env("baseUrl")}/login`)
  })

  it("click to reset", () => {
    cy.visit(`${Cypress.env("baseUrl")}/signup`)
    cy.get("[href='/reset']").click()
    cy.url().should("eq", `${Cypress.env("baseUrl")}/reset`)
  })
})
