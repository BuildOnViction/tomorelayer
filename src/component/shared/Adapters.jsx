import React from 'react'
import { Link } from 'react-router-dom'

export const AdapterLink = React.forwardRef((props, ref) => <Link innerRef={ref} {...props} />)
