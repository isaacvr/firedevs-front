import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './Groups.scss';

import { APIService } from '../../services/APIService';
import Table from '../table/Table';
import { IGroup } from '../../interfaces';

const BLANK_GROUP = {
  name: "",
  teacher: ""
};

export default function Groups() {
  let groupState = useState([]);
  let glist: string[][] = groupState[0];
  let setGList = groupState[1];

  let [ rawGroups, setRawGroups ] = useState([]);
  let [ group, setGroup ] = useState(BLANK_GROUP);
  let [ editing, setEditing ] = useState(false);
  let [ newgp, setNewgp ] = useState(false);

  function getGroups() {
    setGList([]);
    
    APIService.getAllGroups((err: any, groups: any) => {
      if ( !err ) {
        setRawGroups(groups);
        setGList(groups.map((g: any) => [g.name, g.teacher]));
      }
    }, false);
  }

  function save(e: any) {
    e.preventDefault();

    if ( !newgp ) {
      APIService.updateGroup(group as IGroup, (err: any) => {
        if ( err ) {
          Swal.fire({ icon: 'error', text: err.message });
        } else {
          Swal.fire({ icon: 'success', text: "Student updated!" });
          getGroups();
          setEditing(false);
          setNewgp(false);
          setGroup(BLANK_GROUP);
        }
      });
    } else {
      APIService.createGroup(group as any, (err: any) => {
        if ( err ) {
          Swal.fire({ icon: 'error', text: err.message });
        } else {
          Swal.fire({ icon: 'success', text: "Group saved!" });
          getGroups();
          setEditing(false);
          setNewgp(false);
          setGroup(BLANK_GROUP);
        }
      });
    }
  }

  function handleChange(e: any) {
    let name = e.target.name;
    let value = e.target.value;

    let newGroup: any = {};

    newGroup[name] = value;
    newGroup = Object.assign( Object.assign({}, group), newGroup );

    setGroup( newGroup );
  }

  function userAction(event: 'edit' | 'delete', pos: number) {
    switch(event) {
      case 'edit': {
        // console.log("EDIT: ", rawGroups[pos]);
        setGroup(rawGroups[pos]);
        setEditing(true);
        break;
      }
      case 'delete': {
        Swal.fire({
          text: "Do you want to remove this group?",
          icon: 'warning',
          showCancelButton: true,
          showConfirmButton: true,
        }).then((res: any) => {
          if ( res.isConfirmed ) {
            APIService.deleteGroup((rawGroups[pos] as any)._id, (err: any, msg: any) => {
              if ( err ) {
                return Swal.fire({ text: err.message, icon: 'error' });
              }
              Swal.fire({ text: msg.message, icon: 'success' });
              getGroups();
            });
          }
        });
        break;
      }
    }
  }

  useEffect(() => {
    getGroups();
  }, []);

  const HEADERS = [
    "Name", "Guide teacher"
  ];

  return (
    <>
      <div className="buttons container">
        <button onClick={() => { setEditing(true); setNewgp(true); }}> Add group </button>
        <button onClick={ getGroups } className="info"> Refresh </button>
      </div>

      {
        !editing
          ? <Table headers={ HEADERS } data={ glist } eventHandler={ userAction }/>
          : <form className="container student-form" onSubmit={ save }>
            
            <div className="form-field">
              <label htmlFor="#name">Group name</label>
              <input type="text" id="name" name="name" value={group.name} placeholder="Group name..." onChange={ handleChange }/>
            </div>
            
            <div className="form-field">
              <label htmlFor="#teacher">Guide teacher</label>
              <select id="teacher" name="teacher" value={group.teacher} onChange={ handleChange }>
                <option value="" disabled>Select the teacher</option>
                <option value="Juan Carlos">Juan Carlos</option>
                <option value="Amanda Smith">Amanda Smith</option>
                <option value="John Ramos">John Ramos</option>
                <option value="Richard Paulo">Richard Paulo</option>
                <option value="Christina Menendez">Christina Menendez</option>
                <option value="Dina Campos">Dina Campos</option>
                <option value="Marcos Lenox">Marcos Lenox</option>
              </select>
            </div>

            <div className="action-buttons">
              <button onClick={() => { setEditing(false); setNewgp(false); }}>Cancel</button>
              <button type="submit">Save</button>
            </div>
          </form>
      }
    </>
  )

}