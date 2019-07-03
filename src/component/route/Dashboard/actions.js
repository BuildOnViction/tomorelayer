export const UpdateRelayer = (state, relayer) => {
  const Relayers = Array.from(state.Relayers)
  const index = Relayers.findIndex(r => r.id === relayer.id)
  Relayers[index] = relayer
  return {
    Relayers,
    shouldUpdateUserRelayers: true,
  }
}
