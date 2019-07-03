import { AlertVariant } from 'service/frontend'

export const UpdateRelayer = (state, relayer) => {
  const Relayers = Array.from(state.Relayers)

  if (!relayer) {
    return {
      notifications: [
        ...state.notifications,
        {
          variant: AlertVariant.error,
          message: 'relayer data empty',
          open: true,
        }
      ]
    }
  }

  const index = Relayers.findIndex(r => r.id === relayer.id)
  Relayers[index] = relayer
  return {
    Relayers,
    shouldUpdateUserRelayers: true,
  }
}
