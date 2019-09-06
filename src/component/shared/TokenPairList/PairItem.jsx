import React from 'react'
import cx from 'classnames'
import {
  Checkbox,
  Grid,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import InfoIcon from '@material-ui/icons/ArrowDownward'
import Arrows from '@material-ui/icons/CompareArrows'
import {
  ExternalLinks,
} from 'service/backend'
import { StyledLink } from 'component/shared/Adapters'

const CompareArrows = withStyles(theme => ({
  root: {
    color: '#00000052',
    fontSize: 40
  }
}))(Arrows)

const StyledCheckbox = withStyles(theme => ({
  root: {
    color: theme.palette.maintitle,
    opacity: .3,
    '& svg': {
      fontSize: '1rem',
    }
  },
  checked: {
    opacity: 1,
    '& svg': {
      color: theme.palette.link,
    }
  }
}))(Checkbox)

const TokenListItem = withStyles(theme => ({
  root: {
    borderRadius: 0,
    paddingLeft: '0.5em',
    marginTop: 2,
    marginBottom: 0,
    '&.selected': {
      background: theme.palette.tabInactive,
    },
    '&:hover': {
      background: theme.palette.tabInactive,
      '& .info-icon': {
        fontSize: 18,
        color: theme.palette.link,
        transition: 'font-size .5s, color .5s',
        display: 'initial',
      }
    },
  },
}))(ListItem)

const StyledListItemText = withStyles(theme => ({
  primary: {
    color: 'white'
  }
}))(ListItemText)

const StyledListItemIcon = withStyles(theme => ({
  root: {
    paddingLeft: '0.5em',
  }
}))(ListItemIcon)

const PairInfoIcon = withStyles(theme => ({
  root: {
    color: `${theme.palette.link}26`,
    fontSize: 18,
    transition: 'font-size .5s, color .5s',
    display: 'none',
  }
}))(InfoIcon)

const PairDetails = withStyles(theme => ({
  root: {
    background: theme.palette.tabInactive,
    width: '100%',
    margin: 0,
    padding: '0 1em',
  }
}))(Grid)

const DetailGridItem = withStyles(theme => ({
  root: {
    color: theme.palette.subtitle,
    fontSize: 12,
  }
}))(Grid)


export default class PairItem extends React.Component {

  state = {
    showDetails: false
  }

  handleInfoClick = () => this.setState({ showDetails: !this.state.showDetails })

  render() {
    const {
      disabled,
      onChange,
      pair,
    } = this.props

    const {
      showDetails,
    } = this.state

    const cls = cx({ 'selected': showDetails })

    return (
      <React.Fragment>
        <TokenListItem key={pair.toString()} dense button className={cls} onClick={this.handleInfoClick}>
          <StyledListItemIcon>
            <StyledCheckbox
              color={pair.checked ? 'primary' : 'default'}
              checked={pair.checked}
              disabled={disabled}
              onClick={onChange(pair)}
              inputProps={{
                'aria-label': pair.toString(),
              }}
            />
          </StyledListItemIcon>
          <StyledListItemText primary={pair.toString()} />
          <PairInfoIcon className="info-icon" />
        </TokenListItem>
        {showDetails && (
          <PairDetails container spacing={4} justify="space-between" alignItems="center">
            <Grid item container direction="column" xs={5} className="pt-0">
              <DetailGridItem item className="w_100 text-ellipsis">
                {pair.from.name} ({pair.from.symbol})
              </DetailGridItem>
              <DetailGridItem item className="w_100 text-ellipsis">
                Supply: {pair.from.total_supply}
              </DetailGridItem>
              <DetailGridItem item className="w_100 text-ellipsis">
                <span>Address: </span>
                <StyledLink href={ExternalLinks.token(pair.from.address)} rel="noopener noreferrer" target="_blank">
                  {pair.from.address}
                </StyledLink>
              </DetailGridItem>
            </Grid>
            <Grid item xs={2} className="text-center">
              <CompareArrows />
            </Grid>
            <Grid item container direction="column" xs={5} className="pt-0">
              <DetailGridItem item className="w_100 text-ellipsis">
                {pair.to.name} ({pair.to.symbol})
              </DetailGridItem>
              <DetailGridItem item className="w_100 text-ellipsis">
                Supply: {pair.to.total_supply}
              </DetailGridItem>
              <DetailGridItem item className="w_100 text-ellipsis">
                <span>Address: </span>
                <StyledLink href={ExternalLinks.token(pair.to.address)} rel="noopener noreferrer" target="_blank">
                  {pair.to.address}
                </StyledLink>
              </DetailGridItem>
            </Grid>
          </PairDetails>
        )}
      </React.Fragment>
    )
  }
}
