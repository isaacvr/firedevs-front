import React from 'react';
import './Table.scss';
import Edit from '../../assets/edit.svg';
import Delete from '../../assets/delete.svg';

export default function Table({ headers, data, eventHandler }: {
  headers: string[],
  data: string[][],
  eventHandler: Function
}) {
  return (
    <div className="container table-wrapper">
      <table className="table">
        <thead>
          <tr>
            {
              headers.map(h => <th key={h}>{ h }</th>)
            }
          </tr>
        </thead>
        <tbody>
          {
            data.map((row, i) => <tr key={i}>
              {
                row.map((col, j) => <td key={i + '' + j}>{ col }</td>)
              }
              <td className="row-action">
                <img onClick={ () => eventHandler('edit', i) } src={ Edit } alt="Edit" className="action" />
                <img onClick={ () => eventHandler('delete', i) } src={ Delete } alt="Delete" className="action" />
              </td>
            </tr>)
          }
        </tbody>
      </table>
    </div>
  )
}