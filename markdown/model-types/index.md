---
title: Model Types
---

# Model Types

Modern AI systems leverage different architectural approaches to balance performance, efficiency, and capability. This section explores two fundamental model paradigms:

## Dense Models
**Traditional, unified architectures** where every parameter participates in every inference.

- Consistent computational requirements
- Simpler training and deployment

[Learn more about Dense Models →](./dense)

## Mixture-of-Experts (MoE)
**Sparse, conditional architectures** that activate specialized sub-networks ("experts") based on input.

- Dynamic computational scaling
- Specialized knowledge routing

[Learn more about Mixture-of-Experts →](./moe)

---

> 💡 **Key Trade-off**: Dense models offer simplicity and predictability, while MoE architectures provide scalability and efficiency at the cost of implementation complexity.