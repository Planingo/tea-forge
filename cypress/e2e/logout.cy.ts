describe.skip("Logout", () => {
  it("logout", () => {
    cy.visit(`${Cypress.env("baseUrl")}`)
    cy.url().should("contain", "/login")
    cy.get(".ant-form-item-control-input-content > .ant-input").type("lise.fouet@pixel-brew.com")
    cy.get(".ant-input-affix-wrapper > .ant-input").type("Super mon 2 passe !")
    cy.get(".ant-btn").click()
    cy.url().should("eq", `${Cypress.env("baseUrl")}/`)
    cy.get(".ant-menu-title-content").click()
    cy.contains("déconnexion").click()
    cy.url().should("eq", `${Cypress.env("baseUrl")}/login`)
  })
})
