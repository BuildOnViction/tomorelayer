import { Link } from 'react-router-dom'
import logo from '@static/logo.png'


const Header = () => (
  <div className="nav-header mb-2 pl-2">
    <Link to="/" className="nav-header__text mb-2 block">
      Relayer Tracker
    </Link>
    <Link to="/" className="nav-header__logo hidden-xxs hidden-xs hidden-sm block">
      <img
        alt="logo"
        src={logo}
      />
    </Link>
  </div>
)

export default Header
