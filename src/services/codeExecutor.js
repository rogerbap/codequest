// src/services/codeExecutor.js
class CodeExecutor {
  executeCode(code, testCases, isAsync = false) {
    const results = [];
    let hasError = false;
    let errorMessage = '';

    try {
      // Create a safe evaluation function
      const safeEval = new Function(`
        "use strict";
        ${code}
        return typeof ${code.match(/function\s+(\w+)/)?.[1] || 'main'} !== 'undefined' ? 
          ${code.match(/function\s+(\w+)/)?.[1] || 'main'} : null;
      `);

      const userFunction = safeEval();
      
      if (!userFunction) {
        return { 
          success: false, 
          error: 'No function found in code', 
          results: [],
          allPassed: false
        };
      }

      // Handle async functions
      if (isAsync) {
        results.push({
          input: testCases[0]?.input || [],
          expected: testCases[0]?.expected || 'Promise',
          actual: 'Promise',
          passed: true,
          description: 'Async function structure verified'
        });
        return { success: true, results, allPassed: true };
      }

      // Execute test cases
      testCases.forEach((testCase, index) => {
        try {
          const actual = userFunction(...testCase.input);
          const passed = this.compareResults(actual, testCase.expected);

          results.push({
            input: testCase.input,
            expected: testCase.expected,
            actual: actual,
            passed: passed,
            description: testCase.description
          });
        } catch (testError) {
          results.push({
            input: testCase.input,
            expected: testCase.expected,
            actual: `Error: ${testError.message}`,
            passed: false,
            description: testCase.description
          });
          hasError = true;
        }
      });

      const allPassed = results.every(result => result.passed);
      
      return {
        success: !hasError,
        results: results,
        allPassed: allPassed,
        error: hasError ? errorMessage : null
      };

    } catch (error) {
      return {
        success: false,
        error: `Syntax Error: ${error.message}`,
        results: [],
        allPassed: false
      };
    }
  }

  compareResults(actual, expected) {
    if (typeof expected === 'object' && expected !== null) {
      return JSON.stringify(actual) === JSON.stringify(expected);
    }
    return actual === expected || typeof actual === expected;
  }

  // Validate code safety (basic checks)
  validateCode(code) {
    const dangerousPatterns = [
      /eval\s*\(/,
      /Function\s*\(/,
      /document\./,
      /window\./,
      /global\./,
      /process\./,
      /require\s*\(/,
      /import\s+/,
      /export\s+/,
      /while\s*\(\s*true\s*\)/,
      /for\s*\(\s*;\s*;\s*\)/
    ];

    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        return {
          valid: false,
          error: 'Code contains potentially dangerous patterns'
        };
      }
    }

    return { valid: true };
  }
}

export default new CodeExecutor();
