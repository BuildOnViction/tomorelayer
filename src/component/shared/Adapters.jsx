import React from 'react'
import { Link as MuiLink } from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'

export const AdapterLink = React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />)

const StyledLink = withStyles(theme => ({
    root: {
        color: '#577eef'
    }
}))(MuiLink)

export const CustomLink = props => (
    <StyledLink component={AdapterLink} {...props} />
)
