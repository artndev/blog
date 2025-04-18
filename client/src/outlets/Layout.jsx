import '../styles/css/Header.css'
import React, { useContext } from 'react'
import { Outlet, Link } from 'react-router-dom'
import AdminContext from '../contexts/Admin'
import AuthContext from '../contexts/Auth'

function Layout() {
  const { token } = useContext(AuthContext)
  const { admin } = useContext(AdminContext)

  return (
    <>
      <header className="header__container f-md">
        <div className="header">
          <h1 className="f-bg">Blog.</h1>
          <nav className="nav__container">
            <Link className="nav__item" to={'/articles'}>
              ARTICLES
            </Link>
            <Link
              className="nav__item"
              id={`${!token ? 'red' : ''}`}
              to={'/profile'}
            >
              PROFILE
            </Link>
            <Link
              className="nav__item"
              id={`${!admin ? 'red' : ''}`}
              to={'/articles/create'}
            >
              CREATE
            </Link>
          </nav>
        </div>
      </header>

      <Outlet />
    </>
  )
}

export default Layout
