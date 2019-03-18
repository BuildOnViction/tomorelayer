import cx from 'classnames'

export const Input = props => {
  const cls = cx(
    'form__input',
    `form__input--${props.type || 'text'}`,
    {
      'form__input--disabled': props.disabled,
    },
  )
  return (
    <input
      {...props}
      className={cls}
    />
  )
}


export const Form = ({ handleSubmit, children }) => (
  <form onSubmit={handleSubmit} className="form">
    {children}
  </form>
)
