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
              <Checkbox id="ties" v-model:checked="tiedOnly" />
              <Label for="ties" class="ml-3 font-medium cursor-pointer">
                Ties Only
              </Label>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t items-start sm:items-center justify-between">
            <div class="flex gap-3 w-full sm:w-auto">
              <Button variant="outline" @click="fetchTeams" :disabled="loading" class="flex-1 sm:flex-none">
                Teams
              </Button>
              <Button @click="fetchGames" :disabled="loading" class="flex-1 sm:flex-none">
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
          <Button @click="fetchGames" :disabled="loading" variant="outline" size="sm">
            Refresh
          </Button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 justify-items-start">
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

<script setup>
import { ref, onMounted, watch } from 'vue'
import GameCard from './GameCard.vue'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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

const games = ref([])
const apiGames = ref(0)
const results = ref(0)
const loading = ref(false)
const teams = ref([])
const startDate = ref('2025-10-21')
const endDate = ref('')
const season = ref('')
const teamA = ref('')
const teamB = ref('')
const viewType = ref('quarters')
const tiedOnly = ref(false)

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/';

const isDark = useDark({ selector: 'html' })

watch([startDate, endDate, teamA, teamB, viewType, tiedOnly], () => {
  fetchGames()
}, { deep: true })

const toggleDark = () => {
  isDark.value = !isDark.value
}

const resetTeams = () => {
  teamA.value = ''
  teamB.value = ''
}

const fetchTeams = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/teams`);
    const data = await res.json()
    teams.value = data.data || []
  } catch (e) {
    console.error('Teams error:', e)
  }
}

const fetchGames = async () => {
  loading.value = true
  try {
    const params = new URLSearchParams()
    if (startDate.value) params.append('start_date', startDate.value)
    if (endDate.value) params.append('end_date', endDate.value)
    if (tiedOnly.value) params.append('tied_only', 'true')
    params.append('view', viewType.value)

    const res = await fetch(`${API_BASE}/api/games?${params}`)
    const data = await res.json()

    let filteredGames = data.games || []

    if (teamA.value || teamB.value) {
      if (teamA.value && teamB.value) {
        filteredGames = filteredGames.filter(game =>
          (game.home_team.includes(teamA.value) && game.visitor_team.includes(teamB.value)) ||
          (game.home_team.includes(teamB.value) && game.visitor_team.includes(teamA.value))
        )
      } else {
        const teamNames = [teamA.value, teamB.value].filter(Boolean)
        filteredGames = filteredGames.filter(game =>
          teamNames.some(team =>
            game.home_team.includes(team) ||
            game.visitor_team.includes(team)
          )
        )
      }
    }

    games.value = filteredGames
    apiGames.value = data.api_games || 0
    results.value = filteredGames.length

  } catch (error) {
    console.error('Fetch error:', error)
    alert('API connection error')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchTeams()
})
</script>
