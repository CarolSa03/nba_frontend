<script setup>
import { computed, toRefs } from 'vue'
import { Card } from '@/components/ui/card/index.js'
import { useGameCard } from '@/composables/useGameCard'
import { formatDate, extractPeriodScore } from '@/utils/formatters'

const props = defineProps({
  game: {
    type: Object,
    required: true
  },
  viewType: {
    type: String,
    default: 'quarters'
  }
})

const { game, viewType } = toRefs(props)

const {
  winner,
  isSinglePeriodView,
  periodLabel,
  rawPeriodScore,
  isPeriodTied
} = useGameCard(game, viewType)

const periodScoreDisplay = computed(() =>
  extractPeriodScore(rawPeriodScore.value)
)
</script>

<template>
  <div class="game-card h-full flex flex-col" :class="{ 'has-ties': game.tied_quarters?.length }">
    <Card class="flex-1 overflow-hidden hover:shadow-2xl transition-all duration-200 hover:-translate-y-1">
      <div class="p-6 space-y-3">
        <div class="p-6 space-y-3 flex-1 flex flex-col justify-between">
          <div class="flex items-start justify-between">
            <div class="text-sm font-medium text-muted-foreground">
              {{ formatDate(game.date) }}
            </div>
            <div class="text-2xl font-bold text-card-foreground tracking-tight">
              {{ viewType === 'regulation' ? game.regulation_score : game.final_score }}
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between gap-2 mb-4">
          <div class="flex-1">
            <div class="team-badge" :class="{ winner: winner === 'visitor' }">
              {{ game.visitor_team }}
            </div>
          </div>
          <div class="text-muted-foreground font-bold text-lg px-4">VS</div>
          <div class="flex-1">
            <div class="team-badge visitor" :class="{ winner: winner === 'home' }">
              {{ game.home_team }}
            </div>
          </div>
        </div>

        <div v-if="isSinglePeriodView" class="period-view text-center">
          <div class="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            {{ periodLabel }}
          </div>
          <div class="period-score" :class="{ tied: isPeriodTied }">
            {{ periodScoreDisplay }}
          </div>
        </div>

        <div v-else class="quarters">
          <div v-for="(period, label) in game.periods" :key="label" class="quarter">
            <span class="quarter-label">{{ label }}</span>
            <span class="quarter-score">{{ period }}</span>
          </div>
        </div>

        <div v-if="game.tied_quarters?.length" class="ties mt-3">
          <div class="text-xs font-medium text-destructive-foreground uppercase tracking-wide mb-1">
            {{ game.tied_quarters.some(t => t.includes('OT')) ? 'OT Highlights' : 'Tied Moments' }}
          </div>
          <div class="text-sm font-semibold text-destructive">
            {{ game.tied_quarters.join(', ') }}
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<style scoped>
.game-card {
  @apply w-full;
}

.has-ties {
  @apply ring-2 ring-destructive/20 border-l-4 border-destructive;
}

.team-badge {
  @apply px-3 py-2 rounded-lg text-sm font-semibold bg-muted text-muted-foreground border border-border text-center;
}

.team-badge.visitor {
  @apply text-right;
}

.period-view {
  @apply p-6 bg-secondary rounded-xl border border-border;
}

.period-score {
  @apply text-3xl font-black tracking-tight font-mono;
}

.period-score.tied {
  @apply text-destructive font-black drop-shadow-sm;
}

.quarters {
  @apply grid grid-cols-2 gap-2;
}

.quarter {
  @apply flex justify-between items-center p-3 bg-muted rounded-lg border border-border;
}

.quarter-label {
  @apply text-xs font-medium uppercase tracking-wider text-muted-foreground;
}

.quarter-score {
  @apply font-mono font-semibold text-foreground;
}

.custom-badge {
  @apply inline-flex items-center justify-center px-2.5 py-0.5 mt-2 text-xs font-semibold rounded-full bg-secondary text-secondary-foreground border border-border transition-colors;
}

.ties {
  @apply p-3 bg-destructive/5 border border-destructive/20 rounded-lg;
}

.team-badge.winner {
  @apply bg-green-500 text-white border-green-600 shadow-md ring-2 ring-green-500/50;
  transform: scale(1.05);
}
</style>
