---
title: STEM
---

<script setup>
import RecommendationPageIntro from '../../../components/model-selector/RecommendationPageIntro.vue'
</script>

# STEM (Science, Technology, Engineering, Mathematics)

**Models optimized** for technical reasoning, mathematical precision, scientific problem-solving, and code-heavy workflows. These models excel at tasks like deriving equations, debugging complex systems, simulating experiments, and explaining STEM concepts with rigor.

> 💡 **Note**: Modern models in this category support both thinking mode (for deep analytical reasoning) and instruct mode (for direct answers). They outperform standard chat models on logic-heavy, multi-step STEM problems.

<RecommendationPageIntro usageKey="stem" />

# Prompting

STEM models perform best when the problem is stated precisely, the available data is isolated clearly, and the required form of the answer is explicit.

1.  **Define the problem exactly.** Include known values, units, assumptions, and what must be solved.
2.  **Separate data from instructions.** Use code blocks for formulas, tables, equations, logs, or pseudocode.
3.  **Specify the expected output.** Ask for a derivation, final numeric answer, proof sketch, debugging diagnosis, or step-by-step explanation.

Below are examples of well-structured prompts, followed by examples of what to avoid.

## Effective Examples

### Physics Problem Solving

This prompt provides the givens, assumptions, and output requirements.

````md
Solve the following mechanics problem step by step. Show the equations used, substitute the values, and give the final answer with units.

Problem:
```txt
A 2 kg block starts from rest on a frictionless incline that is 5 m long and angled at 30 degrees.
Find:
1. the acceleration of the block along the incline
2. its final speed at the bottom
Take g = 9.8 m/s^2.
```

Do not skip algebra steps.
````

**Why this works:**

*   **Pins down the scenario:** The model has all necessary values and assumptions.
*   **Requests a rigorous format:** The user explicitly wants equations, substitution, and units.
*   **Reduces ambiguity:** The two outputs are clearly enumerated.

### Debugging a Numerical Method

This prompt includes code and a concrete failure mode.

````md
Find the bug in this Python implementation of Newton's method. Explain the issue, then provide a corrected version.

```python
def newton_step(x, f, df):
	return x - f(x) / df

def solve(x0, f, df, steps=5):
	x = x0
	for _ in range(steps):
		x = newton_step(x, f, df)
	return x
```

Observed behavior:
```txt
TypeError: unsupported operand type(s) for /: 'float' and 'function'
```

Keep the same function names in the corrected code.
````

**Why this works:**

*   **Includes the failing code:** The model can inspect the exact implementation.
*   **Includes the observed error:** The failure mode narrows the search space.
*   **Constrains the fix:** Keeping the same function names avoids unnecessary rewrites.

## Poor Examples (What to Avoid)

The following prompts are less effective because they blur the problem statement, omit needed data, or fail to define the expected answer.

### Hand-Wavy Math Request

This prompt does not provide enough information to solve anything reliably.

````md
Can you do this physics question? It's about a block on a ramp.
````

**Why it's ineffective:**

*   **No numerical data:** There are no masses, angles, lengths, or assumptions.
*   **No actual question:** The model does not know what quantity to compute.
*   **No output standard:** It is unclear whether the user wants a hint, derivation, or final answer.

### Missing-Code Debugging Request

This prompt asks for technical debugging without the technical artifact.

````md
My numerical solver is wrong. Fix it.
````

**Why it's ineffective:**

*   **No code or equations:** The model has nothing concrete to inspect.
*   **No observed behavior:** There is no wrong output, traceback, or symptom.
*   **Too open-ended:** "Fix it" invites guesswork instead of diagnosis.

