export const $changeTab = (state, activeTab) => {
  state.Dashboard.activeTab = activeTab
  return state
}

export const $changeConfigItem = (state, activeConfigure) => {
  state.Dashboard.ConfigureBoard.activeConfigure = activeConfigure
  return state
}
