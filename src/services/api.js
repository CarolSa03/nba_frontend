const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/'

export const apiClient = {
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString()
    const url = `${API_BASE}${endpoint}${queryString ? `?${queryString}` : ''}`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  }
}
