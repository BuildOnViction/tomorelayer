import { AlertVariant } from 'service/frontend'

export const UpdateRelayer = (state, { relayer, message }) => {
  const Relayers = Array.from(state.Relayers)
  const index = Relayers.findIndex(r => r.id === relayer.id)
  Relayers[index] = relayer
  return {
    Relayers,
    shouldUpdateUserRelayers: true,
    notifications: [
      ...state.notifications,
      {
        variant: AlertVariant.success,
        message,
        open: true,
      }
    ]
  }
}
