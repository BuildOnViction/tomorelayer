import { createMuiTheme } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'

const theme = createMuiTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
  typography: {
    useNextVariants: true,
  },
  palette: {
    primary: blue,
  },
  overrides: {
    MuiButton: {
      root: {
      },
      sizeSmall: {
        padding: '4px 12px',
      },
      contained: {
        borderRadius: '8px',
        color: '#fff',
        backgroundImage: 'linear-gradient(to right, #703db5, #5b1da3)',
        boxShadow: 'none',
      },
      special: {
        borderRadius: '8px',
        color: '#ddd',
        backgroundImage: 'linear-gradient(to right, #FFF, #5b1da3)',
        boxShadow: 'none',
      }
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
      },
    },
    MuiAvatar: {
      root: {
        width: 100,
        height: 100,
        margin: 0,
        borderRadius: 4,
      },
    },
  },
})

export default theme
