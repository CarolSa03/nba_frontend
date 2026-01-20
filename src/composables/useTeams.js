import { ref } from 'vue'
import { teamsService } from '@/services/teams.service'

export function useTeams() {
  const teams = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function loadTeams() {
    loading.value = true
    error.value = null
    try {
      teams.value = await teamsService.fetchTeams()
    } catch (e) {
      error.value = e
      console.error('Teams error:', e)
    } finally {
      loading.value = false
    }
  }

  return {
    teams,
    loading,
    error,
    loadTeams
  }
}
