import { createMuiTheme } from '@material-ui/core/styles'
import createBreakpoints from '@material-ui/core/styles/createBreakpoints'
/**
   HEX TRANSPARENCY
   100% — FF
   95% — F2
   90% — E6
   85% — D9
   80% — CC
   75% — BF
   70% — B3
   65% — A6
   60% — 99
   55% — 8C
   50% — 80
   45% — 73
   40% — 66
   35% — 59
   30% — 4D
   25% — 40
   20% — 33
   15% — 26
   10% — 1A
   5% — 0D
   0% — 00
 **/
export const availableThemes = {
  dark: {
    palette: {
      tabActive: '#577EEF',
    },
  },
  light: {
    palette: {
      tabActive: 'white',
    },
  },
}

const breakpoints = createBreakpoints({})
const theme = (config) =>
  createMuiTheme({
    props: {
      MuiButtonBase: {
        disableRipple: true,
      },
    },
    typography: {
      fontFamily: ['Nunito Sans', 'sans-serif'].join(','),
    },
    palette: {
      subtitle: '#7473A6',
      maintitle: '#CFCDE1',
      tabActive: '#577EEF',
      tabInactive: '#222239',
      evenRowBackground: '#23233C',
      link: '#577EEF',
      buttonActive: '#703DB5',
      paper: '#272741',
      document: '#1D1E31',
      navItemSelected: '#323252',
    },
    overrides: {
      MuiPaper: {
        root: {
          backgroundColor: '#272741',
          color: '#CFCDE1',
        },
        rounded: {
          borderRadius: '8px',
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
          fontSize: '16px',
          lineHeight: '1',
        },
        subtitle2: {
          fontSize: '12px',
          lineHeight: '1',
          color: '#7473A6',
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
      MuiIcon: {
        root: {
          color: '#703DB5',
        },
        fontSizeLarge: {
          fontSize: '5rem',
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
          display: 'none',
        },
      },
      MuiInputLabel: {
        root: {
          fontSize: '14px',
        },
        outlined: {
          transform: 'none !important',
          display: 'initial',
          color: '#CFCDE1',
          position: 'relative',
          marginBottom: '15px',
        },
      },
      MuiFormLabel: {
        root: {
          '&$disabled': {
            color: '#7473A6',
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
