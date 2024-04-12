describe("Signup", () => {
  it("reset", () => {
    cy.visit(`${Cypress.env("baseUrl")}/reset`)
    cy.url().should("contain", "/reset")
    cy.get(".ant-form-item-control-input-content > .ant-input").type("lise.fouet@pixel-brew.com")
    cy.get(".ant-btn").click()
    cy.url().should("eq", `${Cypress.env("baseUrl")}/reset`)
  })

  it("click to login", () => {
    cy.visit(`${Cypress.env("baseUrl")}/reset`)
    cy.get("[href='/login']").click()
    cy.url().should("eq", `${Cypress.env("baseUrl")}/login`)
  })

  it("click to signup", () => {
    cy.visit(`${Cypress.env("baseUrl")}/reset`)
    cy.get("[href='/signup']").click()
    cy.url().should("eq", `${Cypress.env("baseUrl")}/signup`)
  })
})
