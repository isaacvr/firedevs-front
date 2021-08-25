import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.scss';

interface NavigationElement {
  text: string;
  url: string;
}

export default function Navbar({ items }: { items: NavigationElement[] }) {
  return (
    <nav id="navbar">
      <ul>
        { items.map((e, i) => {
          return <NavLink activeClassName="active" className="nav-item" exact to={ e.url } key={i}> { e.text } </NavLink>
        }) }
      </ul>
    </nav>
  )
}