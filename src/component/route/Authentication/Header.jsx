import React from 'react'
import logo from 'asset/relayer-logo.png'

const Header = () => (
  <div>
    <img
      alt="logo"
      src={logo}
      className="relayer-logo block mb-3"
      height="80"
    />
    <h1>Welcome to TomoChain Relayer Management</h1>
  </div>
)

export default Header
