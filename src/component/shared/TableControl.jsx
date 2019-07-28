import React from 'react'
import {
  Tab,
  Tabs,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'


const StyledTabs = withStyles(theme => ({
  root: {
    minHeight: 30,
  },
  indicator: {
    display: 'none',
  },
}))(Tabs)

const TopicTab = withStyles(theme => ({
  root: {
    textTransform: 'none',
    background: 'transparent',
    marginRight: 80,
    padding: 0,
    minWidth: 32,
    width: 'auto',
    minHeight: 20,
    height: 27,
    borderRadius: 7,
    color: theme.palette.subtitle,
    lineHeight: '10px',
    fontSize: 16,
    '&$selected': {
      color: theme.palette.maintitle,
      background: 'transparent',
    },
  },
  selected: {},
}))(props => <Tab disableRipple {...props} />)

const TableControl = ({
  onTabChange,
  tabValue,
  onPaginationChange,
  topics,
}) => (
  <StyledTabs value={tabValue} onChange={onTabChange}>
    {topics.map(t => <TopicTab key={t} label={t} />)}
  </StyledTabs>
)

export default TableControl
