import React from 'react'
import spinner from 'asset/spinner.svg'

const LoadSpinner = ({
  width,
  height,
  className,
}) => (
  <img
    width={width || 100}
    height={height || 100}
    src={spinner}
    className={className}
    alt="loading..."
  />
)

export default LoadSpinner
