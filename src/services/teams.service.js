import { apiClient } from './api'

export const teamsService = {
  async fetchTeams() {
    const data = await apiClient.get('/teams')
    return data.data || []
  }
}