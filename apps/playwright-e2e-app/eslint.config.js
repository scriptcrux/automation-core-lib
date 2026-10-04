// Inside the external SUT App Repository's eslint.config.js
import { companyAutomationRules } from "@script-crux/core-shared/configs/eslint";

export default [
  ...companyAutomationRules,
  // The SUT team can add local overrides down here if they want!
];
