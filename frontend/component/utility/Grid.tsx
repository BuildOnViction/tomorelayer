import cx from 'classnames'

const Grid = ({
  className = '',
  children,
}) => {
  const cls = cx('grid', className)
  return (
    <div className={cls}>
      {children}
    </div>
  )
}

export default Grid
