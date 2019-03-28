import React from 'react'
import cx from 'classnames'

const Grid = ({
  className = '',
  children,
  ...rest
}) => {
  const cls = cx('grid', className)
  return (
    <div className={cls} {...rest}>
      {children}
    </div>
  )
}

export default Grid
