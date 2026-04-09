---
title: Vision (OCR + other)
---

<script setup>
import RecommendationPageIntro from '../../../components/model-selector/RecommendationPageIntro.vue'
</script>

# Vision

**Vision Enabled Models**, for explaining images, doing OCR, extracting Text, and other vision tasks. 

<RecommendationPageIntro usageKey="vision" />

# Prompting

Vision models work best when you describe the image task precisely and define what kind of output you need. The image itself is only part of the prompt; the instructions around it matter just as much.

1.  **State the visual task explicitly.** Say whether you want OCR, object identification, chart reading, screenshot debugging, or a natural-language description.
2.  **Tell the model what to focus on.** Mention the relevant region, objects, text, or relationship in the image.
3.  **Define the output format.** Ask for JSON, bullet points, extracted text only, a confidence note, or a short explanation depending on your use case.

Below are examples of well-structured prompts, followed by examples of what to avoid.

## Effective Examples

### OCR With Structure

This prompt asks for targeted extraction and constrains the output.

````md
Extract the text from this receipt image.

Output requirements:
- Return valid JSON.
- Include the keys `merchant`, `date`, `total`, and `line_items`.
- `line_items` should be an array of objects with `name` and `price`.
- If a field is unreadable, use `null` instead of guessing.
````

**Why this works:**

*   **Specifies the task type:** The model knows this is OCR and structured extraction, not summarization.
*   **Defines the schema:** The requested JSON shape reduces ambiguity.
*   **Prevents hallucination:** Using `null` for unreadable fields is safer than filling gaps.

### Screenshot Analysis

This prompt narrows the model's attention to a concrete UI problem.

````md
Analyze this screenshot of my web app and identify the likely layout bug.

Focus only on:
- the header,
- the first card in the grid,
- and any overlapping elements near the right edge.

Answer in 3 parts:
1. what looks wrong,
2. the most likely CSS cause,
3. one specific fix to try first.
````

**Why this works:**

*   **Narrows the inspection area:** The model does not need to comment on the entire screenshot.
*   **Requests a diagnostic structure:** The three-part answer keeps the result practical.
*   **Targets actionability:** Asking for one specific fix first reduces noisy speculation.

## Poor Examples (What to Avoid)

The following prompts are less effective because they leave the model guessing what to inspect and how to respond.

### Unfocused Image Prompt

This prompt does not define the job.

````md
What do you see here?
````

**Why it's ineffective:**

*   **No task framing:** The model does not know whether the user wants OCR, description, diagnosis, or extraction.
*   **No output target:** The response could be verbose, generic, or irrelevant.
*   **No attention guidance:** Important details may be ignored.

### Guess-Heavy OCR Request

This prompt encourages unreliable extraction.

````md
Read this blurry document and fill in whatever is missing.
````

**Why it's ineffective:**

*   **Invites hallucination:** "fill in whatever is missing" tells the model to invent unreadable content.
*   **No schema or format:** The user cannot easily validate or reuse the result.
*   **No quality threshold:** The model is not told when to admit uncertainty.


