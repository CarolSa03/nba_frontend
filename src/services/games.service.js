import { apiClient } from './api'

export const gamesService = {
  async fetchGames(filters) {
    const params = {}

    if (filters.startDate) params.start_date = filters.startDate
    if (filters.endDate) params.end_date = filters.endDate
    if (filters.tiedOnly) params.tied_only = 'true'
    params.view = filters.viewType || 'quarters'

    return await apiClient.get('/api/games', params)
  }
}