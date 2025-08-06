// server/seeds/quickFireQuestions.js
const quickFireQuestions = [
  // Level 1: Syntax Basics
  {
    questionId: 1,
    levelId: 1,
    gameMode: 'quickFire',
    title: 'The Missing Semicolon',
    description: 'A simple syntax error is preventing this function from working.',
    difficulty: 'Beginner',
    brokenCode: `function greetUser(name) {
  console.log("Hello, " + name)
  return "Welcome!"
}`,
    fixedCode: `function greetUser(name) {
  console.log("Hello, " + name);
  return "Welcome!";
}`,
    testCases: [
      { input: ["Alice"], expected: "Welcome!", description: "Should greet Alice and return welcome message" },
      { input: ["Bob"], expected: "Welcome!", description: "Should greet Bob and return welcome message" },
      { input: [""], expected: "Welcome!", description: "Should handle empty string" }
    ],
    hint: 'Look for missing punctuation at the end of statements.',
    explanation: 'JavaScript statements should end with semicolons. Missing semicolons can cause unexpected behavior or automatic semicolon insertion issues.',
    points: 33,
    isAsync: false,
    tags: ['syntax', 'semicolon', 'basic']
  },
  {
    questionId: 2,
    levelId: 1,
    gameMode: 'quickFire',
    title: 'Mismatched Brackets',
    description: 'This function has unbalanced brackets.',
    difficulty: 'Beginner',
    brokenCode: `function calculateArea(width, height {
  let area = width * height;
  return area;
}`,
    fixedCode: `function calculateArea(width, height) {
  let area = width * height;
  return area;
}`,
    testCases: [
      { input: [5, 10], expected: 50, description: "Should calculate 5 * 10 = 50" },
      { input: [3, 7], expected: 21, description: "Should calculate 3 * 7 = 21" },
      { input: [0, 5], expected: 0, description: "Should handle zero values" }
    ],
    hint: 'Check if all parentheses are properly closed.',
    explanation: 'Function parameters must be enclosed in parentheses. Missing closing parenthesis causes syntax error.',
    points: 33,
    isAsync: false,
    tags: ['syntax', 'brackets', 'function']
  },
  {
    questionId: 3,
    levelId: 1,
    gameMode: 'quickFire',
    title: 'String Quote Confusion',
    description: 'This string concatenation has quote issues.',
    difficulty: 'Beginner',
    brokenCode: `function createMessage(name) {
  return "Hello " + name + ", welcome to our site!";
}`,
    fixedCode: `function createMessage(name) {
  return "Hello " + name + ", welcome to our site!";
}`,
    testCases: [
      { input: ["John"], expected: "Hello John, welcome to our site!", description: "Should create welcome message" },
      { input: ["Mary"], expected: "Hello Mary, welcome to our site!", description: "Should work with different names" }
    ],
    hint: 'Make sure string quotes are properly matched.',
    explanation: 'Mixed quote types can cause issues. Stay consistent with single or double quotes.',
    points: 34,
    isAsync: false,
    tags: ['syntax', 'strings', 'quotes']
  },
  
  // Level 2: Variable Mysteries
  {
    questionId: 1,
    levelId: 2,
    gameMode: 'quickFire',
    title: 'Variable Scope Mystery',
    description: 'This function should return a value, but something\'s wrong with variable scope.',
    difficulty: 'Beginner',
    brokenCode: `function calculateTotal(price, tax) {
  if (price > 0) {
    let total = price + tax;
  }
  return total;
}`,
    fixedCode: `function calculateTotal(price, tax) {
  let total = 0;
  if (price > 0) {
    total = price + tax;
  }
  return total;
}`,
    testCases: [
      { input: [100, 10], expected: 110, description: "Should calculate total for positive price" },
      { input: [0, 5], expected: 0, description: "Should return 0 for zero price" },
      { input: [-10, 5], expected: 0, description: "Should return 0 for negative price" }
    ],
    hint: 'Variables declared inside blocks have limited scope.',
    explanation: 'The \'total\' variable was declared inside the if block, making it inaccessible outside. Declare it in the function scope.',
    points: 50,
    isAsync: false,
    tags: ['variables', 'scope', 'let']
  },
  {
    questionId: 2,
    levelId: 2,
    gameMode: 'quickFire',
    title: 'Undefined Variable Error',
    description: 'This function references a variable that doesn\'t exist.',
    difficulty: 'Beginner',
    brokenCode: `function processOrder(itemPrice) {
  let discount = 0.1;
  let finalPrice = itemPrice - (itemPrice * discont);
  return finalPrice;
}`,
    fixedCode: `function processOrder(itemPrice) {
  let discount = 0.1;
  let finalPrice = itemPrice - (itemPrice * discount);
  return finalPrice;
}`,
    testCases: [
      { input: [100], expected: 90, description: "Should apply 10% discount to $100" },
      { input: [50], expected: 45, description: "Should apply 10% discount to $50" }
    ],
    hint: 'Check variable names carefully for typos.',
    explanation: 'Variable name \'discont\' is misspelled. It should be \'discount\'.',
    points: 50,
    isAsync: false,
    tags: ['variables', 'typo', 'undefined']
  },
  {
    questionId: 3,
    levelId: 2,
    gameMode: 'quickFire',
    title: 'Const Reassignment',
    description: 'This function tries to modify a constant value.',
    difficulty: 'Beginner',
    brokenCode: `function updateCounter() {
  const count = 0;
  count = count + 1;
  return count;
}`,
    fixedCode: `function updateCounter() {
  let count = 0;
  count = count + 1;
  return count;
}`,
    testCases: [
      { input: [], expected: 1, description: "Should increment and return 1" }
    ],
    hint: 'Constants cannot be reassigned after declaration.',
    explanation: 'Use \'let\' instead of \'const\' when you need to reassign the variable.',
    points: 50,
    isAsync: false,
    tags: ['variables', 'const', 'let', 'reassignment']
  }
  // Add more questions for other levels...
];

module.exports = quickFireQuestions;