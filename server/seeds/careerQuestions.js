// server/seeds/careerQuestions.js
const careerQuestions = [
  // Level 1: JavaScript Fundamentals
  {
    questionId: 1,
    levelId: 1,
    gameMode: 'career',
    title: 'Function Declaration Syntax',
    description: 'This function has a syntax error that prevents it from running properly.',
    difficulty: 'Beginner',
    category: 'Syntax Errors',
    brokenCode: `function calculateSum(a, b {
  return a + b;
}`,
    fixedCode: `function calculateSum(a, b) {
  return a + b;
}`,
    testCases: [
      { input: [5, 3], expected: 8, description: "Should return 8 for inputs 5 and 3" },
      { input: [10, 15], expected: 25, description: "Should return 25 for inputs 10 and 15" },
      { input: [0, 0], expected: 0, description: "Should return 0 for inputs 0 and 0" }
    ],
    hint: 'Check the function parameter list - something is missing.',
    explanation: 'Function parameters must be enclosed in parentheses. The closing parenthesis was missing.',
    points: 40,
    isAsync: false,
    tags: ['syntax', 'function', 'parameters']
  },
  {
    questionId: 2,
    levelId: 1,
    gameMode: 'career',
    title: 'Variable Declaration Error',
    description: 'This code attempts to use a variable before declaring it.',
    difficulty: 'Beginner',
    category: 'Syntax Errors',
    brokenCode: `function greetUser(name) {
  console.log(message);
  let message = "Hello, " + name;
  return message;
}`,
    fixedCode: `function greetUser(name) {
  let message = "Hello, " + name;
  console.log(message);
  return message;
}`,
    testCases: [
      { input: ["Alice"], expected: "Hello, Alice", description: "Should greet Alice properly" },
      { input: ["Bob"], expected: "Hello, Bob", description: "Should greet Bob properly" }
    ],
    hint: 'Variables must be declared before they can be used.',
    explanation: 'In JavaScript, you cannot use a variable before declaring it. Move the declaration before its usage.',
    points: 40,
    isAsync: false,
    tags: ['variables', 'hoisting', 'declaration']
  },
  {
    questionId: 3,
    levelId: 1,
    gameMode: 'career',
    title: 'String Concatenation Fix',
    description: 'This function has an issue with string concatenation.',
    difficulty: 'Beginner',
    category: 'Syntax Errors',
    brokenCode: `function createFullName(firstName, lastName) {
  return firstName + + lastName;
}`,
    fixedCode: `function createFullName(firstName, lastName) {
  return firstName + " " + lastName;
}`,
    testCases: [
      { input: ["John", "Doe"], expected: "John Doe", description: "Should create full name with space" },
      { input: ["Jane", "Smith"], expected: "Jane Smith", description: "Should work with different names" }
    ],
    hint: 'Check the concatenation operator - something looks wrong.',
    explanation: 'String concatenation requires a single + operator. Double ++ is incorrect syntax. Also add a space between names.',
    points: 40,
    isAsync: false,
    tags: ['strings', 'concatenation', 'operators']
  },

  // Level 2: Object Operations
  {
    questionId: 1,
    levelId: 2,
    gameMode: 'career',
    title: 'Object Property Access',
    description: 'This function tries to access object properties incorrectly.',
    difficulty: 'Beginner',
    category: 'Object Manipulation',
    brokenCode: `function getPersonInfo(person) {
  return person.name + " is " + person[age] + " years old";
}`,
    fixedCode: `function getPersonInfo(person) {
  return person.name + " is " + person.age + " years old";
}`,
    testCases: [
      { 
        input: [{ name: "Alice", age: 25 }], 
        expected: "Alice is 25 years old", 
        description: "Should access object properties correctly" 
      },
      { 
        input: [{ name: "Bob", age: 30 }], 
        expected: "Bob is 30 years old", 
        description: "Should work with different values" 
      }
    ],
    hint: 'Check how object properties are being accessed.',
    explanation: 'Object properties can be accessed with dot notation (person.age) or bracket notation with quotes (person["age"]). Using person[age] without quotes treats age as a variable.',
    points: 60,
    isAsync: false,
    tags: ['objects', 'properties', 'access']
  },
  {
    questionId: 2,
    levelId: 2,
    gameMode: 'career',
    title: 'Object Method Call',
    description: 'This function has an error when calling an object method.',
    difficulty: 'Beginner',
    category: 'Object Manipulation',
    brokenCode: `function processArray(arr) {
  return arr.length();
}`,
    fixedCode: `function processArray(arr) {
  return arr.length;
}`,
    testCases: [
      { input: [[1, 2, 3]], expected: 3, description: "Should return length of array [1,2,3]" },
      { input: [["a", "b"]], expected: 2, description: "Should return length of array ['a','b']" },
      { input: [[]], expected: 0, description: "Should return 0 for empty array" }
    ],
    hint: 'Think about whether length is a property or a method.',
    explanation: 'Array.length is a property, not a method. You access it without parentheses.',
    points: 60,
    isAsync: false,
    tags: ['arrays', 'properties', 'methods']
  },
  {
    questionId: 3,
    levelId: 2,
    gameMode: 'career',
    title: 'Null Check Error',
    description: 'This function doesn\'t safely handle null or undefined objects.',
    difficulty: 'Intermediate',
    category: 'Object Manipulation',
    brokenCode: `function safeGetName(person) {
  return person.name.toUpperCase();
}`,
    fixedCode: `function safeGetName(person) {
  return person && person.name ? person.name.toUpperCase() : "";
}`,
    testCases: [
      { 
        input: [{ name: "alice" }], 
        expected: "ALICE", 
        description: "Should convert name to uppercase" 
      },
      { 
        input: [null], 
        expected: "", 
        description: "Should handle null input safely" 
      },
      { 
        input: [{ age: 25 }], 
        expected: "", 
        description: "Should handle object without name property" 
      }
    ],
    hint: 'What happens if person is null or doesn\'t have a name property?',
    explanation: 'Always check if objects and properties exist before accessing them to avoid runtime errors.',
    points: 60,
    isAsync: false,
    tags: ['objects', 'null-check', 'safety', 'defensive-programming']
  }
];

module.exports = careerQuestions;