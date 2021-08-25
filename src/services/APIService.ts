import axios from 'axios';
import qs from 'qs';
import { SERVER } from '../constants';
import { IGroup, IStudent } from '../interfaces';

function getOptions(url: string, data: any, method?: string): any {
  return {
    method: method || 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data),
    url,
  };
}

export class APIService {
  static getAllStudents(cb: Function, withGroup?: boolean) {
    axios.get(SERVER + '/students' + (withGroup ? 'f' : ''))
      .then((res) => {
        cb(null, res.data);
      }).catch((err) => cb(err.response ? err.response.data : err));
  }

  static getStudent(email: string, cb: Function, withGroup?: boolean) {
    axios.get(SERVER + '/student' + (withGroup ? 'f' : '') + '/' + email)
      .then(({ data }) => {
        cb(null, data);
      }).catch((err) => cb(err.response ? err.response.data : err));
  }

  static getAllGroups(cb: Function, withStudents?: boolean) {
    axios.get(SERVER + '/groups' + (withStudents ? 'f' : ''))
      .then(({ data }) => {
        cb(null, data);
      }).catch((err) => cb(err.response ? err.response.data : err));
  }

  static getGroup(id: string, cb: Function, withStudents?: boolean) {
    axios.get(SERVER + '/group' + (withStudents ? 'f' : '') + '/' + id)
      .then(({ data }) => {
        cb(null, data);
      }).catch((err) => cb(err.response ? err.response.data : err));
  }

  static createStudent(data: IStudent, cb: Function) {
    axios( getOptions(SERVER + '/student', data) )
      .then((data) => {
        cb(null, data);
      })
      .catch(err => cb(err.response ? err.response.data : err));
  }
  
  static createGroup(data: IGroup, cb: Function) {
    axios( getOptions(SERVER + '/group', data) )
      .then((data) => {
        cb(null, data);
      })
      .catch(err => cb(err.response ? err.response.data : err));
  }

  static updateStudent(data: IStudent, cb: Function) {
    axios( getOptions(SERVER + '/student/' + data.email, data, 'PUT') )
      .then(({ data }) => cb(null, data))
      .catch(err => cb(err.response ? err.response.data : err));
  }

  static updateGroup(data: IGroup, cb: Function) {
    axios( getOptions(SERVER + '/group/' + data._id, data, 'PUT') )
      .then(({ data }) => cb(null, data))
      .catch(err => cb(err.response ? err.response.data : err));
  }

  static deleteStudent(email: string, cb: Function) {
    axios.delete(SERVER + '/student/' + email)
      .then(({ data }) => cb(null, data))
      .catch(err => cb(err.response ? err.response.data : err));
  }

  static deleteGroup(id: string, cb: Function) {
    axios.delete(SERVER + '/group/' + id)
      .then(({ data }) => cb(null, data))
      .catch(err => cb(err.response ? err.response.data : err));
  }
}