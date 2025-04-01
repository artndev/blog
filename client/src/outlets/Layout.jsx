import "../styles/css/Header.css"
import React from 'react'
import { Outlet, Link } from 'react-router-dom'


function Layout() {
  return (
    <>
        <header className="header__container">
            <div className="header__subcontainer">
              <h3 className="header__logo">
                Blog.
              </h3>
              <nav className="nav__container">
                <Link className="nav__item lnkg" to={"/articles/create"}>
                  CREATE
                </Link>
                <Link className="nav__item lnkg" to={"/articles"}>
                  ARTICLES
                </Link>
                <Link className="nav__item lnkg" to={"/profile"}>
                  PROFILE
                </Link>
              </nav>
            </div>
        </header>

        <Outlet />
    </>
  )
}

export default Layout