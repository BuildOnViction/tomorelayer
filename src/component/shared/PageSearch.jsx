import React from 'react'
import Downshift from 'downshift'
import { makeStyles } from '@material-ui/core/styles'
import {
  TextField,
  InputAdornment,
  Paper,
  Menu,
  MenuItem,
  Button,
  withStyles,
  ClickAwayListener,
  Box,
  Link,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import relayerUrl from 'asset/relayer.svg'
import issuerUrl from 'asset/issuer.svg'
import contractUrl from 'asset/contract.svg'

const Icons = {
  'relayer': relayerUrl,
  'token': issuerUrl,
  'contract': contractUrl,
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    position: 'relative',
  },
  paper: {
    position: 'absolute',
    zIndex: 1,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0,
    [theme.breakpoints.down('sm')]: {
      position: 'unset',
    },
  },
  inputRoot: {
    flexWrap: 'wrap',
    [theme.breakpoints.down('sm')]: {
      backgroundColor: '#323252',
    },
  },
  inputInput: {
    width: 'auto',
    flexGrow: 1,
  },
}))

const renderInput = (inputProps) => {
  const { InputProps, classes, ref, ...other } = inputProps

  return (
    <TextField
      InputProps={{
        inputRef: ref,
        classes: {
          root: classes.inputRoot,
          input: classes.inputInput,
        },
        endAdornment: (
          <InputAdornment position="end">
            <SearchIcon style={{ width: 17, height: 17, opacity: .3 }} />
          </InputAdornment>
        ),
        ...InputProps,
      }}
      {...other}
    />
  )
}

const renderSuggestion = (suggestionProps) => {
  const { suggestion, index, itemProps, highlightedIndex, selectedItem } = suggestionProps
  const isHighlighted = highlightedIndex === index
  const isSelected = (selectedItem || '').indexOf(suggestion.label) > -1

  const routeParser = suggestedItem => {

    const tomoscanUrl = process.env.REACT_APP_STAT_SERVICE_URL
    const tomorelayerUrl = window.location.origin

    switch (suggestedItem.type) {
    case 'contract':
      return `${tomoscanUrl}/address/${suggestedItem.address}`
    case 'token':
      return `${tomoscanUrl}/tokens/${suggestedItem.address}`
    case 'relayer':
      return `${tomorelayerUrl}/dashboard/${suggestedItem.coinbase}`
    default:
      return ''
    }
  }

  return (
    <MenuItem
      {...itemProps}
      key={suggestion._id}
      selected={isHighlighted}
      component={Link}
      style={{
        fontWeight: isSelected ? 500 : 400,
      }}
      href={routeParser(suggestion)}
      color="inherit"
      rel="noopener noreferrer"
      target="_blank"
    >
      <img style={{width: 15, height: 15, marginRight: 7}} src={Icons[suggestion.type]} alt={suggestion.type}/>
      <span>{ `${suggestion.name} (${suggestion.type})` }</span>
    </MenuItem>
  )
}

const getSuggestions = (value, suggestions) => {
  const inputValue = value.trim().toLowerCase()
  const inputLength = inputValue.length

  return inputLength === 0 ? [] : suggestions
}

export const PageSearch = ({ searchResult, onChange }) => {
  const classes = useStyles()

  return (
    <div className={classes.root}>
      <Downshift id="downshift-simple">
        {({
          getInputProps,
          getItemProps,
          getLabelProps,
          getMenuProps,
          highlightedIndex,
          inputValue,
          isOpen,
          selectedItem,
        }) => {
          const { onBlur, onFocus, ...inputProps } = getInputProps({
            placeholder: 'Search Relayers/Tokens/Contracts…',
            onChange: onChange,
          })

          return (
            <div className={classes.container}>
              {renderInput({
                fullWidth: true,
                variant:'outlined',
                classes,
                inputProps,
              })}

              <div {...getMenuProps()}>
                {isOpen ? (
                  <Paper className={classes.paper} square>
                    {getSuggestions(inputValue, searchResult).map((suggestion, index) =>
                      renderSuggestion({
                        suggestion,
                        index,
                        itemProps: getItemProps({ item: suggestion.name }),
                        highlightedIndex,
                        selectedItem,
                      }),
                    )}
                  </Paper>
                ) : null}
              </div>
            </div>
          )
        }}
      </Downshift>
    </div>
  )
}

export default PageSearch

const MenuButton = withStyles(theme => ({
  root: {
    textTransform: 'none',
    margin: `0px ${theme.spacing(2)}px`,
    color: theme.palette.maintitle,
    [theme.breakpoints.down('sm')]: {
      margin: 0,
    },
  }
}))(props => {
  const InnerIcon = props.icon
  return (
    <Button {...props} size="small">
      {props.text} <InnerIcon style={{ marginLeft: 5 }} />
    </Button>
  )
})

const DropDownMenu = withStyles(theme => ({
  paper: {
    width: 320,
    height: 'fit-content',
    maxHeight: 'unset',
    [theme.breakpoints.down('sm')]: {
      padding: '0 15px',
    },
  }
}))(Menu)

export const PageSearchResponsive = React.forwardRef((props, ref) => {
  const [
    anchorEl,
    setAnchorEl,
  ] = React.useState(null)

  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  return (
    <Box>
      <MenuButton
        aria-label="User"
        aria-controls="relayer-list-menu"
        aria-haspopup="true"
        onClick={handleClick}
        text=""
        icon={SearchIcon}
      />
      <ClickAwayListener onClickAway={handleClose}>
        <DropDownMenu
          id="relayer-list-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          style={{ transform: 'translateY(40px)' }}
        >
          <Box ref={ref}>
            <PageSearch
              onChange={props.onChange}
              searchResult={props.searchResult}
              disabled={props.disabled}
            />
          </Box>
        </DropDownMenu>
      </ClickAwayListener>
    </Box>
  )
})
