import React from 'react'
import { Link, NavLink } from 'react-router-dom'

export const AdapterLink = React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />)

export const AdapterNavLink = React.forwardRef((props, ref) => <NavLink innerRef={ref} {...props} />)
