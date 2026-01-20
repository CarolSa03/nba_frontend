import { ref, watch } from 'vue'

export function useGameFilters(onFilterChange) {
  const startDate = ref('2025-10-21')
  const endDate = ref('')
  const teamA = ref('')
  const teamB = ref('')
  const viewType = ref('quarters')
  const tiedOnly = ref(false)
  const sortDescending = ref(true)

  watch(
    [startDate, endDate, teamA, teamB, viewType, tiedOnly],
    () => {
      if (!startDate.value || !endDate.value) {
        sortDescending.value = true
      }
      console.log('Watch triggered, tiedOnly:', tiedOnly.value)
      onFilterChange?.()
    },
    { deep: true }
  )

  function resetTeams() {
    teamA.value = ''
    teamB.value = ''
  }

  function getFilters() {
    return {
      startDate: startDate.value,
      endDate: endDate.value,
      teamA: teamA.value,
      teamB: teamB.value,
      viewType: viewType.value,
      tiedOnly: tiedOnly.value,
      sortDescending: sortDescending.value
    }
  }

  return {
    startDate,
    endDate,
    teamA,
    teamB,
    viewType,
    tiedOnly,
    sortDescending,
    resetTeams,
    getFilters
  }
}
