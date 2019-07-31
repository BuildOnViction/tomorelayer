import React from 'react'
import { MuiThemeProvider } from '@material-ui/core/styles'
import createStore from 'redux-zero'
import { Provider, connect } from 'redux-zero/react'
import { initialState } from 'service/store'
import theme, { availableThemes } from '../theme.config'

export const TestApp = ({
  testStore,
  inject,
  component: Component,
}) => {
  const store = createStore({
    ...initialState,
    ...testStore,
  })

  const mapTheme = state => ({
    activeTheme: state.activeTheme
  })

  const connected = connect(mapTheme)

  const InjectedComponent = connect(inject)(Component)

  const BootstrappedApp = connected(({ activeTheme }) => (
    <MuiThemeProvider theme={theme(availableThemes[activeTheme])}>
      <InjectedComponent />
    </MuiThemeProvider>
  ))

  return (
    <Provider store={store}>
      <BootstrappedApp />
    </Provider>
  )
}
