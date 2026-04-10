---
title: Personal Assistant
---

<script setup>
import RecommendationPageIntro from '../../../components/model-selector/RecommendationPageIntro.vue'
</script>

# Personal Assistant Use Case

Recommendations for models that excel at memory, context retention, and personalized interactions.

> 💡 **Note**: For personal assistant tasks-such as recalling preferences, maintaining conversation history, managing schedules, or adapting tone over time-**instruct-tuned models with strong long-context handling** are preferred over thinking-tuned variants. These models prioritize coherence, empathy, and user-specific adaptation over raw analytical power.

<RecommendationPageIntro usageKey="personal-assistant" />

# Prompting

To get the best results from a personal assistant model, structure your prompts around the user's preferences, the immediate task, and the exact form of the response you want.

1.  **State the user context clearly.** Include the preferences, constraints, and background details the assistant should remember for this task.
2.  **Define the assistant's job.** Be explicit about whether it should plan, draft, summarize, remind, or ask follow-up questions.
3.  **Constrain the output.** Specify the tone, format, length, and whether the assistant should make assumptions or request clarification.

Below are examples of well-structured prompts, followed by examples of what to avoid.

## Effective Examples

### Planning Around Preferences

This prompt gives the assistant the user's constraints and a clear deliverable.

````md
You are my personal assistant. Help me plan meals for the next 3 workdays.

User preferences:
```yaml
diet: vegetarian
allergies:
	- peanuts
weekday_cooking_time: 20 minutes max
dislikes:
	- mushrooms
goal: high protein lunches
```

Output requirements:
- Give exactly 3 lunch ideas.
- Each idea must include a short ingredient list and a 1-sentence prep summary.
- Do not suggest anything with peanuts or mushrooms.
- If a recipe normally uses meat, adapt it.
````

**Why this works:**

*   **Provides durable user context:** The preferences and restrictions are explicit.
*   **Assigns a concrete task:** The model knows it is producing lunch plans, not general advice.
*   **Constrains the response:** The output format prevents rambling and reduces irrelevant suggestions.

### Drafting a Message

This prompt defines the relationship, tone, and exact communication goal.

````md
Draft a reply to my manager.

Context:
```txt
She asked whether I can present the Q2 metrics on Friday.
I can do it, but I need the latest dashboard export by Thursday afternoon.
Tone should be professional and concise.
```

Write a 4-6 sentence email that:
- confirms I can present,
- asks for the dashboard export by Thursday afternoon,
- and mentions that I will share a draft deck before the meeting.
````

**Why this works:**

*   **Supplies the missing situational details:** The model has the necessary facts to write the message.
*   **Specifies tone and medium:** "professional and concise" plus "email" narrows the style.
*   **Defines success criteria:** The required points make the draft easier to trust and reuse.

## Poor Examples (What to Avoid)

The following prompts are less effective because they force the model to guess your preferences, priorities, or intended output.

### Preference-Free Planning Request

This prompt asks for personalized help without any personalization.

````md
What should I eat this week?
````

**Why it's ineffective:**

*   **No user context:** There are no dietary needs, schedule constraints, or goals.
*   **No output shape:** The model does not know whether to give recipes, groceries, or a full plan.
*   **Too broad:** "this week" can mean anything from one meal to a seven-day calendar.

### Underspecified Writing Request

This prompt gives too little information to draft a useful message.

````md
Write a message to my boss.
````

**Why it's ineffective:**

*   **Missing purpose:** The model does not know whether the message is about scheduling, status, or a problem.
*   **No tone guidance:** The draft could easily come back too casual or too formal.
*   **No factual constraints:** Without details, the model is likely to invent context you did not provide.

