import wretch from 'wretch'
import { API } from '@constant'

wretch().defaults({
  headers: {
    "Accept": "application/json; charset=UTF-8"
  }
})

export const AppInitializer = store => ({
  fetchRegisteredRelayers: () => {
    wretch(API.relayers).get().json(resp => store.setState({ relayers: resp.payload }))
  }
})
