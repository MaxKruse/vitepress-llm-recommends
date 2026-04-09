import { describe, expect, it } from 'bun:test'

import { MODEL_NAMES as M } from './constants/models'
import { QUANTIZATIONS as Q } from './constants/quantizations'
import { RECOMMENDED_USAGE as U } from './constants/usage'
import type { RecommendationRule } from './types'
import { getMatchingRecommendations } from './utils'

describe('getMatchingRecommendations', () => {
  it('prefers the largest matching quantization for duplicate model entries', () => {
    const rules: RecommendationRule[] = [
      {
        ramMin: 32,
        vramMin: 0,
        usefulness: 0.9,
        models: [
          {
            name: M.GLM_4_7_FLASH,
            parameters: 30,
            quantization: Q.Q4_K_XL,
            usage: U.CODING,
          },
        ],
      },
      {
        ramMin: 64,
        vramMin: 0,
        usefulness: 0.8,
        models: [
          {
            name: M.GLM_4_7_FLASH,
            parameters: 30,
            quantization: Q.Q8_K_XL,
            usage: U.INSTRUCT,
          },
        ],
      },
    ]

    const [recommendation] = getMatchingRecommendations(64, 0, rules)

    expect(recommendation?.quantization).toBe(Q.Q8_K_XL)
    expect(recommendation?.usefulness).toBe(0.9)
    expect(recommendation?.usage).toBe(U.CODING | U.INSTRUCT)
  })
})
