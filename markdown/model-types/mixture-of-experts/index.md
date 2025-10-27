---
title: Mixture of Experts (MoE)
---

# Mixture of Experts (MoE)

MoE models use sparse activation—only a subset of "expert" subnetworks are active per input—enabling larger capacity with manageable compute costs.

## Why are MoE models so fast?

In a traditional dense model (e.g., a 14B model), every input token must be processed against all 14B parameters.

In a Mixture of Experts model, this changes. A single "Dense" Gate layer acts as a router. For each token, this gate determines which "experts" (subnetworks) are most likely to provide the best output. It then routes the token *only* to that small subset of experts (e.g., 2 or 8 out of 128 experts in the entire model).

This means that if you have a 14B MoE model with 2B active parameters, the computation speed will be similar to that of a much smaller 2B dense model, not a 14B one. This process repeats for every single token generated:

1.  The gate layer selects the best experts for the current token.
2.  Those experts compute the next token.
3.  The new token is added to the sequence.
4.  The gate layer re-evaluates and picks a new set of experts for the new token.

## Can I just load the active parameters to save memory?

No, this isn't possible because the selection of experts happens on a **per-token basis**, not a per-prompt basis.

If you were to only load the active experts, the process would be incredibly slow. For *every single token*, the system would have to:

1.  Load the dense gate layer from disk.
2.  Decide which experts to use.
3.  Unload the gate layer.
4.  Load the required expert layers from disk.
5.  Compute the single next token.
6.  Unload the experts.
7.  Repeat the entire process.

This constant loading and unloading from disk (even a fast NVME) is dramatically slower than keeping all the model's layers in RAM or VRAM, where they can be accessed almost instantly.

## How does running a large MoE on a small GPU work?

If you are running a 30GB model on a GPU with only 4GB of VRAM, you are **not** running the model on your GPU. You are using **CPU/GPU Offloading**.

In this scenario:
* The vast majority of the model (e.g., 26GB+) is loaded into your system's **RAM**.
* A small portion (4GB) is loaded into the much faster **VRAM**.
* The CPU handles most of the work, using the RAM.

Your speeds will be similar to running in a 100% CPU-only mode. While the small active parameter count (e.g., 3B) makes CPU inference faster than you might expect for a 30GB model, you are not getting the full speed benefits of GPU inference.

## Can I adjust the number of active experts?

No. Models you download are pre-configured with the **optimal number of active experts**. This number is chosen by the model's creators to provide the best balance of speed and quality.

This "optimal" number is determined by testing the model's **perplexity (PPL)**, which is a measure of its error rate (lower is better). The creators find the "local minimum" PPL, which is the number of experts that produces the most accurate results.

* **Reducing active experts:** This will make the model faster, but the output quality will get much worse because it doesn't have enough relevant information.
* **Increasing active experts:** This will slow the model down and also *reduce* quality. The extra experts "pollute" the output and confuse the others. As the analogy goes, "more cooks don't make a better soup."

**TL;DR:** Don't change the number of active experts. It will reduce output quality.

## How to use llama.cpp correctly with an MoE model

### Finding the optimal GPU layers

You don't need to find them manually. The `llama.cpp` tool added a flag, `-cpu-moe`, to handle this.

The simple method is to:
1.  Load as many GPU layers as you can with the `-ngl` flag.
2.  Use the `-n-cpu-moe <N>` flag and adjust `<N>` until the model loads and runs.

For a more technical approach, you can calculate `<N>` for the flag `-n-cpu-moe <Layer Count - N>`:
1.  Find the model's total layers and the size per layer (e.g., 36GB file / 48 layers = 0.75GB per layer).
2.  Find your available VRAM (e.g., Total VRAM - VRAM already in use).
3.  Calculate `N` = `Available VRAM in GB` / `SizePerLayer`
4.  Example for a 12GB card with 4GB in use: (12 - 4) / 0.75 ≈ 11.
5.  Your flag would be `-n-cpu-moe <48 - 11>`, so `-n-cpu-moe 37`.

### Speed Differences Between Quantizations

What matters for speed is not just the *number* of active parameters, but the total *file size (GB)* of the activated experts.

A smaller, more heavily quantized model will be faster, even with the same architecture. For example, in a CPU-only test:
* **36GB (Q8) File:** 336 pp (prompt processing) / 20 t/s (token generation)
* **11GB (Q2_K) File:** 835 pp / 41 t/s

The smaller 11GB file is nearly 3x faster at processing the prompt and 2x faster at generating tokens because less data needs to be moved and processed for each step.


# Sources

- **[https://huggingface.co/blog/moe](https://huggingface.co/blog/moe)**