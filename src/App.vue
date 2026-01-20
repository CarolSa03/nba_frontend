<script setup>
import { onMounted } from 'vue'
import GameCard from './components/GameCard.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from '@/components/ui/select'
import { Sun, Moon } from 'lucide-vue-next'
import { useDark } from '@vueuse/core'
import { useTeams } from '@/composables/useTeams'
import { useGames } from '@/composables/useGames'
import { useGameFilters } from '@/composables/useGameFilters'

const isDark = useDark({ selector: 'html' })

const { teams, loadTeams } = useTeams()
const { games, apiGames, loading, resultsCount, fetchGames } = useGames()
const {
  startDate,
  endDate,
  teamA,
  teamB,
  viewType,
  tiedOnly,
  sortDescending,
  resetTeams,
  getFilters
} = useGameFilters(() => handleSearch())

function handleSearch() {
  fetchGames(getFilters())
}

const toggleDark = () => {
  isDark.value = !isDark.value
}

onMounted(() => {
  loadTeams()
})
</script>

<template>
  <div class="nba-ties min-h-screen bg-background text-foreground p-4 md:p-8 max-w-7xl mx-auto">
    <div class="text-center mb-12">
      <h1 class="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-foreground/80 to-primary/80 bg-clip-text text-transparent mb-8">
        NBA
      </h1>

      <Card class="max-w-4xl mx-auto">
        <CardContent class="p-8 space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input v-model="startDate" type="date" placeholder="Start Date" />
            <Input v-model="endDate" type="date" placeholder="End Date" />
            <div v-if="startDate && endDate" class="col-span-full flex justify-center pt-2">
              <Button
                variant="outline"
                size="sm"
                :class="{ 'bg-primary text-primary-foreground': !sortDescending }"
                @click="sortDescending = !sortDescending"
                class="flex items-center gap-2"
              >
                <span class="h-4 w-4">{{ sortDescending ? '▼' : '▲' }}</span>
                {{ sortDescending ? 'Newest First' : 'Oldest First' }}
              </Button>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div class="grid grid-cols-2 gap-2">
              <Select v-model="teamA" class="w-full">
                <SelectTrigger>
                  <SelectValue placeholder="Team A" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="team in teams"
                    :key="team.id"
                    :value="team.full_name"
                  >
                    {{ team.full_name }}
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select v-model="teamB" class="w-full">
                <SelectTrigger>
                  <SelectValue placeholder="Team B" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="team in teams"
                    :key="team.id"
                    :value="team.full_name"
                  >
                    {{ team.full_name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="flex items-center">
              <Button
                variant="outline"
                size="sm"
                @click="resetTeams"
              >
                Clear teams
              </Button>

              <Button
                variant="ghost"
                size="sm"
                @click="toggleDark"
                class="w-10 h-10 p-0 rounded-full hover:bg-accent hover:scale-105 transition-all duration-200"
              >
                <Moon class="h-5 w-5" v-if="isDark" />
                <Sun class="h-5 w-5" v-else />
              </Button>
            </div>
          </div>

          <div class="grid grid-cols-1 md:flex md:gap-4 items-end">
            <div class="flex-1">
              <Select v-model="viewType">
                <SelectTrigger class="w-full">
                  <SelectValue placeholder="View Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quarters">Full Game</SelectItem>
                  <SelectItem value="regulation">Full Game without OT</SelectItem>
                  <SelectItem value="halftime">Halftime</SelectItem>
                  <SelectItem value="q1">Q1</SelectItem>
                  <SelectItem value="q3">Q3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="flex items-center p-4 border rounded-lg">
              <input
                id="ties"
                type="checkbox"
                v-model="tiedOnly"
              />
              <Label for="ties" class="ml-3 font-medium cursor-pointer">
                Ties Only
              </Label>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t items-start sm:items-center justify-between">
            <div class="flex gap-3 w-full sm:w-auto">
              <Button variant="outline" @click="loadTeams" :disabled="loading" class="flex-1 sm:flex-none">
                Teams
              </Button>
              <Button @click="handleSearch" :disabled="loading" class="flex-1 sm:flex-none">
                {{ loading ? 'Searching...' : 'Search' }}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div v-if="loading" class="flex flex-col items-center justify-center py-24 text-center">
      <div class="w-16 h-16 border-4 border-border border-t-primary rounded-full animate-spin mb-6"></div>
      <p class="text-xl text-muted-foreground">Loading games...</p>
    </div>

    <div v-else-if="!games.length" class="flex flex-col items-center justify-center py-24 text-center">
      <h2 class="text-3xl font-bold text-muted-foreground mb-2">No games found</h2>
    </div>

    <div v-else class="mt-8 space-y-4">
      <div class="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <p class="text-2xl font-bold">
          {{ resultsCount }} {{ resultsCount === 1 ? 'game' : 'games' }} found
          <span v-if="apiGames !== resultsCount" class="text-muted-foreground text-sm ml-2">
            ({{ apiGames }} from API)
          </span>
        </p>
        <Button @click="handleSearch" :disabled="loading" variant="outline" size="sm">
          Refresh
        </Button>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GameCard
          v-for="game in games"
          :key="game.id || `${game.date}-${game.final_score}`"
          :game="game"
          :view-type="viewType"
        />
      </div>
    </div>
  </div>
</template>
