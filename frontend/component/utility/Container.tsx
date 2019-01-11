const Container = ({
  full = false,
  grid = false,
  className = '',
  children,
}) => {
  const isGrid = grid ? ' grid' : ''
  const containerType = full ? 'container-full' : 'container'
  const fullclass = containerType + isGrid + ' ' + className
  return (
    <div className={fullclass} >
      {children}
    </div>
  )
}

export default Container
