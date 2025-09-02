/// <reference types="Cypress" />
const { randomBytes } = require("node:crypto");

Cypress.Commands.add("loginAs", (user) => {
  const loginToken = randomBytes(12).toString("base64");
  cy.task("associateLoginToken", { user, loginToken });
  cy.setCookie("loginToken", loginToken);
});
