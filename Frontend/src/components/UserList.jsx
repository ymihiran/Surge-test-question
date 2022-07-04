import React, { useState,useEffect } from "react";
import './styles/notes.style.css';
import axios from 'axios';


export default function UserList() {

  const[request,setRequest] = useState([]);

  useEffect(()=>{
          
      axios.get("http://localhost:8070/user/").then((res)=>{
            setRequest(res.data.existingUsers);
            console.log(res.data);
          }).catch((err)=>{
              alert(err.message);
           })
      

  },[])

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
                <th scope="col">ID</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">E-mail Address</th>
                <th scope="col">Account Type</th>
                <th scope="col">Status</th>
                <th scope="col">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
            {request.map((data,index)=>(
                    
                    <tr key={index}>
                       <th scope="row">{index+1}</th>
                       <td>{data._id}</td>
                       <td>{data.firstName}</td>
                       <td>{data.lastName}</td>
                       <td>{data.email}</td>
                       <td>{data.accountType}</td>
                       <td>{data.status ? ("Registered" ) :  "Pending"}</td>                     
                      

                       <td>
  
                         <a className="btn btn-warning" href="/credit-card-validation/EditSalary2"  >
                            <i className= "fas fa-edit"></i>&nbsp;Edit
                         </a>
                         &nbsp;
                         <a className="btn btn-danger" href="/credit-card-validation/deleteSalary" >
                            <i className= "fas fa-trash-alt"></i>&nbsp;Delete
                         </a>
  
                       </td>
  
                    </tr>
                  
  
             ))}
                </tbody>
          </table>

        </div>

        
      </div>
    );
}