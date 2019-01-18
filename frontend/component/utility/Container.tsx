import cx from 'classnames'

const Container = ({
  full = false,
  center = false,
  className = '',
  children,
}) => {
  const cls = cx({
    'container': !full,
    'container-full': full,
    'center': center,
  }, className)
  return (
    <div className={cls} >
      {children}
    </div>
  )
}

export default Container
