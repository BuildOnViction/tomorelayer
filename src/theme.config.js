import { createMuiTheme } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: blue,
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: '2px',
      },
      sizeSmall: {
        padding: '4px 12px',
      },
      contained: {
        boxShadow: 'none',
      },
    },
    MuiOutlinedInput: {
      root: {
        fontSize: '14px',
      },
      inputMarginDense: {
        paddingTop: 10,
        paddingBottom: 10,
      },
    },
    MuiInputLabel: {
      root: {
        fontSize: '14px',
      },
      outlined: {
        '&$marginDense': {
          transform: 'translate(12px, 11px) scale(1)',
        },
      }
    },
    MuiAvatar: {
      root: {
        width: 200,
        height: 200,
        margin: 0,
        borderRadius: 4,
      }
    }
  }
})

export default theme
