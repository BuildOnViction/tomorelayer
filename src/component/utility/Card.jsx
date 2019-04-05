import React from 'react'

const Card = ({ children, className }) => (
  <div className={`card elevated ${className}`}>
    {children}
  </div>
)
export default Card
