---
title: Storywriting
---

<script setup>
import RecommendationPageIntro from '../../../components/model-selector/RecommendationPageIntro.vue'
</script>

# Storywriting & Creative Writing

**Narrative-tuned models** optimized for immersive storytelling, rich character arcs, evocative prose, and genre-aware stylistic control. These models excel at crafting original fiction, expanding existing worlds, generating dialogue with emotional nuance, and maintaining long-range plot coherence—even across tens of thousands of tokens.

<RecommendationPageIntro usageKey="storywriting" />

# Prompting

Creative writing models respond best when you specify the story constraints without over-constraining the prose itself. Strong prompts define the premise, voice, stakes, and scene goals.

1.  **Establish the creative frame.** State the genre, point of view, tone, and any worldbuilding rules that matter.
2.  **Define the scene objective.** Explain what must happen emotionally or plot-wise in the passage.
3.  **Use stylistic constraints carefully.** Ask for concrete qualities like pacing, sensory detail, or dialogue density instead of vague requests like "make it better."

Below are examples of well-structured prompts, followed by examples of what to avoid.

## Effective Examples

### Writing a Focused Scene

This prompt sets a clear premise and emotional target.

````md
Write a 900-1200 word fantasy scene in third-person limited from Mara's point of view.

Story context:
```txt
Mara is a novice archivist who has secretly used forbidden magic to restore damaged manuscripts.
Tonight she discovers that one of the restored books has begun rewriting itself with details from her own future.
```

Scene requirements:
- The scene takes place alone in the archive after midnight.
- The tone should be tense and intimate, not action-heavy.
- Include at least one moment where Mara is tempted to keep reading and one moment where she considers burning the book.
- End with a reveal that someone else has already annotated the future text.
````

**Why this works:**

*   **Provides narrative scaffolding:** The model knows the character, setting, and core conflict.
*   **Targets the emotional shape:** "tense and intimate" is more actionable than a generic quality label.
*   **Defines the ending beat:** The reveal gives the scene a destination.

### Revising for Style

This prompt provides source text and a specific revision goal.

````md
Revise the paragraph below to feel more lyrical and atmospheric while preserving the original events and meaning. Keep it to one paragraph.

Original:
```txt
Jon walked into the abandoned train station. It was quiet and cold. He saw a suitcase on a bench and heard water dripping somewhere in the dark.
```

Constraints:
- Do not change the point of view.
- Do not add new plot events.
- Emphasize sound and texture.
````

**Why this works:**

*   **Supplies the text to transform:** The model can revise instead of inventing from scratch.
*   **Preserves intent:** The constraints guard against plot drift.
*   **Names the craft target:** "sound and texture" is concrete and useful.

## Poor Examples (What to Avoid)

The following prompts are less effective because they are too vague, too contradictory, or too dependent on the model guessing your taste.

### Generic Story Request

This prompt does not give the model enough creative direction.

````md
Write a fantasy story.
````

**Why it's ineffective:**

*   **No premise:** The model has to invent the setting, conflict, and characters from nothing.
*   **No scale:** It is unclear whether the user wants a paragraph, scene, outline, or full story.
*   **No stylistic direction:** The result will usually be generic fantasy prose.

### Contradictory Revision Prompt

This prompt asks for incompatible outcomes at the same time.

````md
Rewrite this to be more subtle, more dramatic, shorter, more detailed, and completely different.
````

**Why it's ineffective:**

*   **Conflicting goals:** "shorter" and "more detailed" pull in opposite directions.
*   **No priority order:** The model cannot tell which requirement matters most.
*   **Undefined revision scope:** "completely different" conflicts with the idea of a rewrite.


