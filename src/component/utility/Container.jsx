import React from 'react'
import cx from 'classnames'

const Container = ({
  full = false,
  center = false,
  right = false,
  className = '',
  children,
}) => {
  const cls = cx(
    'container',
    {
      'container--full': full,
      'container--center': center,
      'container--right': right,
    },
    className,
  )
  return (
    <div className={cls} >
      {children}
    </div>
  )
}

export default Container
