import { computed } from 'vue'

export function useGameCard(game, viewType) {
  const winner = computed(() => {
    const finalScore = game.value?.final_score || '0-0'
    const [visitorScore, homeScore] = finalScore.split('-').map(Number)
    if (homeScore > visitorScore) return 'home'
    if (visitorScore > homeScore) return 'visitor'
    return null
  })

  const isSinglePeriodView = computed(() =>
    ['halftime', 'q1', 'q3'].includes(viewType.value)
  )

  const periodData = computed(() => {
    const periods = game.value?.periods || {}
    const mapping = {
      halftime: { label: 'Halftime', score: periods.Q2 },
      q1: { label: 'Q1', score: periods.Q1 },
      q3: { label: 'Q3', score: periods.Q3 }
    }
    return mapping[viewType.value] || {}
  })

  const periodLabel = computed(() => periodData.value.label || '')
  const rawPeriodScore = computed(() => periodData.value.score || '')

  const isPeriodTied = computed(() => {
    const score = rawPeriodScore.value
    if (!score || score === '0-0') return false
    const [home, away] = score.split('-').map(Number)
    return home === away
  })

  return {
    winner,
    isSinglePeriodView,
    periodLabel,
    rawPeriodScore,
    isPeriodTied
  }
}