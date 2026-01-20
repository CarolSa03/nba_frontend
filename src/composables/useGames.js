import { ref, computed } from 'vue'
import { gamesService } from '@/services/games.service'
import { filterGamesByTeams, filterTiedGames, sortGamesByDate } from '@/utils/gameFilters'

export function useGames() {
  const games = ref([])
  const apiGames = ref(0)
  const loading = ref(false)
  const error = ref(null)

  async function fetchGames(filters) {
    loading.value = true
    error.value = null

    try {
      const data = await gamesService.fetchGames(filters)
      let filteredGames = data.games || []
        
      if (filters.tiedOnly) {
        filteredGames = filterTiedGames(filteredGames)
      }

      filteredGames = filterGamesByTeams(filteredGames, filters.teamA, filters.teamB)

      if (filters.startDate && filters.endDate) {
        filteredGames = sortGamesByDate(filteredGames, filters.sortDescending)
      }

      games.value = filteredGames
      apiGames.value = data.api_games || 0
    } catch (e) {
      error.value = e
      console.error('Fetch error:', e)
      alert('API connection error')
    } finally {
      loading.value = false
    }
  }

  const resultsCount = computed(() => games.value.length)

  return {
    games,
    apiGames,
    loading,
    error,
    resultsCount,
    fetchGames
  }
}
