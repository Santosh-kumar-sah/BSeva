// Evaluates a single rule condition against a citizen profile field value

function evaluateCondition(profileValue, operator, ruleValue) {
  // If profile value is missing
  if (profileValue === undefined || profileValue === null) {
    return {
      passed: false,
      missingField: true,
      reason: 'Missing profile attribute'
    };
  }

  let passed = false;

  switch (operator) {
    case 'EQUALS':
      if (typeof profileValue === 'boolean' || typeof ruleValue === 'boolean') {
        passed = Boolean(profileValue) === Boolean(ruleValue);
      } else {
        passed = String(profileValue).trim().toUpperCase() === String(ruleValue).trim().toUpperCase();
      }
      break;

    case 'NOT_EQUALS':
      passed = String(profileValue).trim().toUpperCase() !== String(ruleValue).trim().toUpperCase();
      break;

    case 'GREATER_THAN':
      passed = Number(profileValue) > Number(ruleValue);
      break;

    case 'GREATER_THAN_OR_EQUAL':
      passed = Number(profileValue) >= Number(ruleValue);
      break;

    case 'LESS_THAN':
      passed = Number(profileValue) < Number(ruleValue);
      break;

    case 'LESS_THAN_OR_EQUAL':
      passed = Number(profileValue) <= Number(ruleValue);
      break;

    case 'IN':
      if (Array.isArray(ruleValue)) {
        const normalizedList = ruleValue.map(v => String(v).trim().toUpperCase());
        passed = normalizedList.includes(String(profileValue).trim().toUpperCase());
      }
      break;

    case 'NOT_IN':
      if (Array.isArray(ruleValue)) {
        const normalizedList = ruleValue.map(v => String(v).trim().toUpperCase());
        passed = !normalizedList.includes(String(profileValue).trim().toUpperCase());
      }
      break;

    case 'CONTAINS':
      if (Array.isArray(profileValue)) {
        passed = profileValue.some(v => String(v).trim().toUpperCase() === String(ruleValue).trim().toUpperCase());
      }
      break;

    default:
      passed = false;
  }

  return {
    passed,
    missingField: false,
    reason: passed ? 'Condition satisfied' : 'Condition criteria not met'
  };
}

module.exports = {
  evaluateCondition
};
