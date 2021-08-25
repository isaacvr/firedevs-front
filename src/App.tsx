import React from 'react';
import 'sweetalert2/src/sweetalert2.scss';
import './App.scss';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Navbar from './components/navbar/Navbar';
import Students from './components/students/Students';
import Groups from './components/groups/Groups';

import StudentsIcon from './assets/students.svg';
import GroupsIcon from './assets/groups.svg';

function App() {
  const NAVBAR = [
    { text: "Home", url: "/" },
    { text: "Students", url: "/students" },
    { text: "Groups", url: "/groups" },
  ];

  return (
    <Router>
      <Navbar items={NAVBAR}/>

      <Switch>
        <Route path="/students">
          <Students />
        </Route>

        <Route path="/groups">
          <Groups />
        </Route>

        <Route path="/">
          <div className="home container">
            <h1>Welcome to Firedevs DB</h1>
            <div className="card-container">
              <Link to="/students" style={{ textDecoration: "none", color: "inherit" }}>
                <div className="card">
                  <img src={ StudentsIcon } alt="" />
                  <div className="text">Students</div>
                </div>
              </Link>
              <Link to="/groups" style={{ textDecoration: "none", color: "inherit" }}>
                <div className="card">
                  <img src={ GroupsIcon } alt="" />
                  <div className="text">Groups</div>
                </div>
              </Link>
            </div>
          </div>
        </Route>
      </Switch>

    </Router>
  )
}

export default App
