import React, { useState } from "react";
import './styles/notes.style.css';


export default function UserList() {

    return(
        <div style={{ backgroundColor: "white" }}>
        <div className="t-list-head-container">
          <label className="h-text">User List</label>
        </div>

        <div className="t-list-tb-container">
          
          <table className="t-table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Specialization</th>
                <th scope="col">Type</th>
                <th scope="col">Marks</th>
                <th scope="col" style={{ width: "100px" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
                    <tr>
                        <td>Cell 1</td>
                        <td>Cell 2</td>
                        <td>Cell 3</td>
                        <td>Cell 4</td>
                        <td>Cell 5</td>
                    </tr>
                    <tr>
                        <td>Cell 1</td>
                        <td>Cell 2</td>
                        <td>Cell 3</td>
                        <td>Cell 4</td>
                        <td>Cell 5</td>
                    </tr>
                    <tr>
                        <td>Cell 1</td>
                        <td>Cell 2</td>
                        <td>Cell 3</td>
                        <td>Cell 4</td>
                        <td>Cell 5</td>
                    </tr>
                    <tr>
                        <td>Cell 1</td>
                        <td>Cell 2</td>
                        <td>Cell 3</td>
                        <td>Cell 4</td>
                        <td>Cell 5</td>
                    </tr>
                    <tr>
                        <td>Cell 1</td>
                        <td>Cell 2</td>
                        <td>Cell 3</td>
                        <td>Cell 4</td>
                        <td>Cell 5</td>
                    </tr>
                </tbody>
          </table>

        </div>

        
      </div>
    );
}