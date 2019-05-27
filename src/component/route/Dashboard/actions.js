export const $changeTab = (state, activeTab) => {
  state.Dashboard.activeTab = activeTab
  return state
}

export const $changeConfigItem = (state, activeConfig) => {
  state.Dashboard.ConfigureBoard.activeConfig = activeConfig
  return state
}
