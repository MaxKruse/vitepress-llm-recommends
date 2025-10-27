---
title: Coding
---

# Coding Recommendations  
**Prioritizing Very High Precision in Code Generation and Debugging**

When working with AI-assisted coding, **precision is non-negotiable**. Even minor hallucinations, syntactic errors, or incorrect logic can introduce bugs, security vulnerabilities, or maintenance debt. These recommendations are tailored for developers who require **extremely high-fidelity outputs**—not just plausible-looking code, but **correct, production-ready, and logically sound** implementations.

Use the selector below to identify the best model for a given hardware configuration:

<script setup>
import ModelSelector from '../../../components/ModelSelector.vue'

const models = [
      { ramMin: 64, vramMin: 16, models: [{"Qwen3 Coder 30B A3B Instruct": { parameters: 30, quantization: 'BF16' }}], usefulness: 1.0},
      { ramMin: 32, vramMin: 16, models: [{"Qwen3 Coder 30B A3B Instruct": { parameters: 30, quantization: 'Q8_K_XL' }}], usefulness: 0.7},
      { ramMin: 32, vramMin: 6, models: [{"Qwen3 Coder 30B A3B Instruct": { parameters: 30, quantization: 'Q6_K_XL' }}], usefulness: 0.5},
      { ramMin: 16, vramMin: 4, models: [{"Qwen3 4B Instruct 2507": { parameters: 4, quantization: 'F16' }}], usefulness: 0.3},
      { ramMin: 16, vramMin: 0, models: [{"Qwen3 4B Instruct 2507": { parameters: 4, quantization: 'Q4_K_XL' }}], usefulness: 0},
    ]

</script>

<ModelSelector :modelDefinitions="models" />

# Prompting

To effectively prompt coding models in a chat-based interface, consider the following guidelines:

1.  **State your goal clearly.** Provide context for your request. An authoritative tone often yields better results.
2.  **Use code blocks.** Enclose any code, error messages, data structures, or formatting examples within markdown code blocks for clarity.
3.  **Provide examples.** Include relevant code snippets or data samples to illustrate your request.

Below are some examples of well-structured prompts.

## Generating a Function

This prompt clearly defines the input data structure and the desired outcome.

````md
Write a JavaScript function that generates a descriptive sentence about a person, given an input object with the following structure:

```ts
type Status = "dead" | "alive";

interface Person {
  name: string;
  age: number;
  status: Status;
}
```

The function should return a grammatically correct sentence.
````

## Requesting Debugging Help

This prompt provides both the error and the code that produced it, creating a complete context for the model.

````md
I have encountered this error:

```
Error: Cannot divide by zero
```

In the following JavaScript code:

```js
function divide(a, b) {
  if (b === 0) {
    throw new Error("Cannot divide by zero");
  }
  return a / b;
}
```

Can you help me refactor the error handling to be more user-friendly?
````