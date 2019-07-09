import { createMuiTheme } from '@material-ui/core/styles'
import createBreakpoints from '@material-ui/core/styles/createBreakpoints'
import blue from '@material-ui/core/colors/blue'

const breakpoints = createBreakpoints({})
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
    MuiPaper: {
      root: {
        backgroundColor: '#272741',
        color: '#CFCDE1',
      },
    },
    MuiContainer: {
      root: {
        [breakpoints.up('xs')]: {
          paddingLeft: '15px',
          paddingRight: '15px',
        },
      },
    },
    MuiTypography: {
      root: {
        color: '#cfcde1',
        marginBottom: '15px',
        lineHeight: '1',
      },
      subtitle1: {
        fontSize: '24px',
        lineHeight: '1',
      },
      subtitle2: {
        fontSize: '30px',
        lineHeight: '1',
      },
      body1: {
        fontSize: '14px',
        lineHeight: '1',
      },
      body2: {
        fontSize: '14px',
        lineHeight: '1',
        color: '#7473A6',
      },
    },
    MuiTab: {
      root: {},
    },
    MuiLink: {
      root: {
        'color': '#fff',
        'margin': '0',
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
        '&$disabled': {
          color: '#56527b',
        },
      },
      input: {
        padding: '.5em 2em',
        [breakpoints.down('md')]: {},
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
          transform: 'none !important',
          display: 'initial',
          color: '#CFCDE1',
          position: 'relative',
          marginBottom: '15px',
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
