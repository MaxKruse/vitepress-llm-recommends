---
title: Instruct Models
---

<script setup>
import RecommendationPageIntro from '../../../components/model-selector/RecommendationPageIntro.vue'
</script>

# Instruct-Tuned Models

Instruct-tuned models are AI assistants trained specifically to understand and follow your directions-whether you're asking for help writing an email, summarizing a document, planning a trip, or explaining a complex idea. Unlike raw base models, these are fine-tuned to respond helpfully, clearly, and on-topic.

<RecommendationPageIntro usageKey="instruct" />

# Prompting

To effectively prompt a model in a chat-based interface, follow these guidelines:

1.  **Be Clear and Specific.** State your goal and provide all necessary context. An authoritative tone often yields better results.
2.  **Use Code Blocks.** Isolate data, error messages, or code snippets from your instructions by enclosing them in markdown code blocks.
3.  **Provide Examples.** If you want a specific style or format, show the model what you mean. When specifying a tone, describe it (e.g., "Act as a formal, professional writer") rather than providing a quote for it to mimic.

Below are examples of well-structured prompts, followed by examples of what to avoid.

## Effective Examples

### Extract Data from Text

This prompt clearly defines a data extraction task.

````md
You are a technical documentation writer. Extract the three main steps from the following text and list them as numbered items. Each item must be a single, complete sentence. Do not add any explanations.

Text:
```txt
To install the software first download the installer from the website then run the setup wizard and finally restart your computer when prompted.
```
````

**Why this works:**

*   **Sets a clear role:** "You are a technical documentation writer."
*   **Defines a single task:** Extract and list three steps.
*   **Specifies precise output constraints:** Requests a numbered list, complete sentences, and explicitly forbids extra explanations.

### Classification

This prompt showcases an effective and constrained classification task.

````md
Classify the following customer feedback as "positive", "negative", or "neutral". Output only one word.

Feedback:
```txt
The product arrived on time but the packaging was damaged.
```
````

**Why this works:**

*   **Presents a simple task:** Classify feedback into one of three categories.
*   **Provides a strict output format:** Restricts the answer to a single word, leaving no room for ambiguity.

## Poor Examples (What to Avoid)

The following prompts are less effective because they lack the context, formatting, and clarity needed for a predictable response, forcing the model to guess the user's intent.

### Conflicting Instructions

This prompt overwhelms the model with competing and contradictory requests.

````md
Summarize this article and make it engaging and professional but keep it short and also highlight the key insights and recommendations while maintaining the author's tone and perspective.

<article text goes here>
````

**Why it's ineffective:**

*   **Competing Instructions:** The prompt asks the model to summarize, be engaging, be professional, be short, highlight insights, and maintain tone all at once.
*   **Contradictory Goals:** The request to keep it "short" conflicts with the need to "highlight key insights and recommendations."

### Lacking Direction

This prompt is too vague to be useful.

````md
Tell me about climate change.
````

**Why it's ineffective:**

*   **Overly Broad:** The prompt doesn't specify a role, an audience, an output format, a length, or a particular aspect of the topic to focus on. The model has no choice but to return a generic, high-level summary.

### Ambiguous Instructions

This prompt's core logic is confusing and poorly defined.

````md
You are a helpful Assistant. The user will tell you how to act, but your job is to act the direct opposite. Example:

User: "You are now a pirate that talks in riddles"
Assistant: "I am not a clown that says it how it is"
````

**Why it's ineffective:**

*   **Ambiguous Logic:** The instruction to act the "direct opposite" is subjective and not clearly defined, forcing the model to guess the user's intent.
*   **Confusing Example Format:** The model may misinterpret the `User:` / `Assistant:` format as literal text it should include in its response, rather than as a guide for its behavior.