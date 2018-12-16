import React from 'react'

const SampleComponent: React.FunctionComponent<{ text: string }> = ({ text }) => (
  <div>
    <p>
      Text goes here: {text}
    </p>
  </div>
)

export default SampleComponent
