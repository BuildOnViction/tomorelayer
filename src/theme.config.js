import { createMuiTheme } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'

const theme = createMuiTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
  },
  typography: {
    fontFamily: ['Nunito Sans', 'sans-serif'].join(','),
  },
  palette: {
    primary: blue,
  },
  overrides: {
    MuiTab: {
      root: {},
    },
    MuiLink: {
      root: {
        'color': '#fff',
        '&:hover': {
          textDecoration: 'none !important',
        },
      },
    },
    MuiButton: {
      root: {
        padding: '8px 15px',
      },
      sizeSmall: {},
      sizeLarge: {},
      contained: {
        borderRadius: '8px',
        color: '#fff',
        background: 'linear-gradient(to right, #703db5, #5b1da3)',
        boxShadow: 'none',
        textTransform: 'none',
        lineHeight: '1',
        minWidth: '170px',
      },
      containedSecondary: {
        background: '#323252!important',
      },
    },
    MuiOutlinedInput: {
      root: {
        'fontSize': '14px',
        'background': '#272741',
        'borderRadius': '8px',
        'borderColor': '#fff',
        'color': '#CFCDE1',
        '&:placeholder': {
          color: '#52527B',
        },
      },
      notchedOutline: {
        border: '0',
      },
    },
    MuiInputLabel: {
      root: {
        fontSize: '14px',
      },
      outlined: {
        '&$marginDense': {
          transform: 'translate(12px, 11px) scale(1)',
          display: 'none',
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
