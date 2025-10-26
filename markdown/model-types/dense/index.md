---
title: Dense Models
---

# Dense Models

Dense models activate **all parameters** for every input. They are simpler to train, but have lower inference throughput (Tokens/s) than Mixture-of-Experts (MoE) models of a similar *total* parameter count (due to the Mixture-of-Experts model only activating a fraction of the parameters per token).

## How Dense Models Work

In a dense Large Language Model (LLM), every layer processes the entire input using **all of its parameters**, regardless of the specific tokens or context. This means:

- **Full parameter utilization**: Every weight in the model contributes to the output for any given input.
- **Straightforward architecture**: Dense models follow standard transformer architectures without dynamic routing or conditional computation.
- **Easier to train**: Due to their simpler architecture, dense models are generally more straightforward to train (although training any large model is still extremely difficult).

## Tradeoffs

Given that a dense model has lower inference throughput than an MoE model of the same *total* parameter count, one might question why one would even use them.

One part of this answer is the relative **ease of training and iteration**. The simpler architecture is easier to debug and allows for faster experimentation with changes, like new activation functions.

Another, more important difference, is **parameter efficiency**. In an MoE, different experts (which are themselves small dense models) might learn to store similar information, leading to potential *redundancy*. In a dense model, all parameters are interconnected and used for every input. This means a 24B dense model may store knowledge with less redundancy than a 24B MoE model.

Therefore, if **knowledge density** (the amount of unique information stored per parameter) is the main priority, a dense model can be more parameter-efficient, though this comes at the significant cost of slower inference.