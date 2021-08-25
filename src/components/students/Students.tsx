import React, { useState, useEffect } from 'react';
import Moment from 'moment';
import Swal from 'sweetalert2';
import './Students.scss';

import { APIService } from '../../services/APIService';
import Table from '../table/Table';
import { IGroup, IStudent } from '../../interfaces';

const BLANK_STUDENT = {
  name: "",
  age: 0,
  sex: "Male",
  email: "",
  bornDate: "1995-01-01",
  city: "",
  group: ""
};

export default function Students() {
  let listState = useState([]);
  let slist: string[][] = listState[0];
  let setSList = listState[1];

  let groupState = useState([]);
  let glist: IGroup[] = groupState[0];
  let setGList = groupState[1];

  let [ rawStudents, setRawStudents ] = useState([]);
  let [ student, setStudent] = useState(BLANK_STUDENT);

  let [ editing, setEditing ] = useState(false);
  let [ newst, setNewst ] = useState(false);

  function getStudents() {
    const withGroup = true;

    setSList([]);

    APIService.getAllStudents((err: any, students: any) => {
      if ( err ) {
        console.log('ERROR: ', err); // Handle errors later
        return;
      }
      setRawStudents(students);
      setSList(students.map((st: any) => {
        return [
          st.name, +st.age, st.sex, st.email,
          Moment(+st.bornDate).format("MM/DD/YYYY"), st.city,
          withGroup ? st.group.name : st.group
        ];
      }));

    }, withGroup);
  }

  function getGroups() {
    APIService.getAllGroups((err: any, groups: any) => {
      if ( !err ) {
        setGList(groups);
      }
    }, false);
  }

  function save(e: any) {
    e.preventDefault();

    if ( !newst ) {
      let st: any = Object.assign({}, student);
      st.bornDate = Moment(st.bornDate).toDate().getTime();

      APIService.updateStudent(st as IStudent, (err: any) => {
        if ( err ) {
          Swal.fire({ icon: 'error', text: err.message });
        } else {
          Swal.fire({ icon: 'success', text: "Student updated!" });
          getStudents();
          setEditing(false);
          setNewst(false);
          setStudent(BLANK_STUDENT);
        }
      });
    } else {
      let u: any = Object.assign({}, student);
      u.bornDate = Moment(student.bornDate).toDate().getTime(); /// Parse date before send

      APIService.createStudent(u as IStudent, (err: any) => {
        if ( err ) {
          console.log("ERR: ", err);
          Swal.fire({ icon: 'error', text: err.message });
        } else {
          Swal.fire({ icon: 'success', text: "Student saved!" });
          getStudents();
          setEditing(false);
          setNewst(false);
          setStudent(BLANK_STUDENT);
        }
      });
    }
  }

  function handleChange(e: any) {
    let name = e.target.name;
    let value = e.target.value;

    switch(name) {
      case 'age': {
        value = Math.max(18, Math.min(27, +value));
        break;
      }
    }

    let newUser: any = {};

    newUser[name] = value;
    newUser = Object.assign( Object.assign({}, student), newUser );

    setStudent( newUser );
  }

  function userAction(event: 'edit' | 'delete', pos: number) {
    switch(event) {
      case 'edit': {
        let st: any = Object.assign({}, rawStudents[pos]);
        st.bornDate = Moment(+st.bornDate).toDate().toISOString().substr(0, 10);;
        setEditing(true);
        setStudent( st );
        break;
      }
      case 'delete': {
        Swal.fire({
          text: "Do you want to remove this student?",
          icon: 'warning',
          showCancelButton: true,
          showConfirmButton: true,
        }).then((res: any) => {
          if ( res.isConfirmed ) {
            APIService.deleteStudent((rawStudents[pos] as any).email, (err: any, msg: any) => {
              if ( err ) {
                return Swal.fire({ text: err.message, icon: 'error' });
              }
              Swal.fire({ text: msg.message, icon: 'success' });
              getStudents();
            });
          }
        });
        break;
      }
    }
  }

  useEffect(() => {
    getStudents();
    getGroups();
  }, []);

  const HEADERS = [
    "Name", "Age", "Sex", "Email", "Date of birth", "City of birth", "Group"
  ];

  return (
    <div className="student-component">
      <div className="buttons container">
        <button onClick={() => { setEditing(true); setNewst(true); }}> Add student </button>
        <button onClick={ getStudents } className="info"> Refresh </button>
      </div>

      {
        !editing
          ? <Table headers={ HEADERS } data={ slist } eventHandler={ userAction }/>
          : <form className="container student-form" onSubmit={ save }>
            
            <div className="form-field">
              <label htmlFor="#name">Name</label>
              <input type="text" id="name" name="name" value={student.name} placeholder="Full name..." onChange={ handleChange }/>
            </div>
            
            <div className="form-field">
              <label htmlFor="#age">Age</label>
              <input type="number" id="age" name="age" value={student.age} placeholder="Age" min="18" max="27" onChange={ handleChange }/>
            </div>
            
            <div className="form-field">
              <label htmlFor="#sex">Sex</label>
              <select id="sex" name="sex" value={student.sex} onChange={ handleChange }>
                <option value="" disabled>Select the sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="#email">Email</label>
              <input type="email" id="email" name="email" value={student.email} placeholder="Email" onChange={ handleChange }/>
            </div>

            <div className="form-field">
              <label htmlFor="#bornDate">Date of birdth</label>
              <input type="date" id="bornDate" name="bornDate" value={student.bornDate} onChange={ handleChange }/>
            </div>
            
            <div className="form-field">
              <label htmlFor="#city">City</label>
              <select id="city" name="city" value={student.city} onChange={ handleChange }>
                <option value="" disabled>Select the city</option>
                <option value="New York">New York</option>
                <option value="California">California</option>
                <option value="Alabama">Alabama</option>
                <option value="Miami">Miami</option>
                <option value="Austin">Austin</option>
                <option value="Colorado">Colorado</option>
                <option value="Delaware">Delaware</option>
                <option value="San Francisco">Delaware</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="#group">Group</label>
              <select id="group" name="group" value={student.group} onChange={ handleChange }>
                <option value="" disabled>Select the group</option>e4
                {
                  glist.map(g => <option key={ g._id } value={ g._id }>{ g.name }</option>)
                }
              </select>
            </div>
            
            <div className="action-buttons">
              <button onClick={() => { setEditing(false); setNewst(false);}}>Cancel</button>
              <button type="submit">Save</button>
            </div>
          </form>
      }
    </div>
  )

}