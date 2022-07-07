import React, { useState,useEffect } from "react";
import './styles/notes.style.css';
import axios from 'axios';
import LoadingOverlay from 'react-loading-overlay';
import PropagateLoader from 'react-spinners/PropagateLoader';
import { Store } from 'react-notifications-component'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import { confirmAlert } from 'react-confirm-alert';
import Cookie from "js-cookie";

export default function UserList() {

  const[request,setRequest] = useState([]);
  const[pagecount,setPageCount] = useState(0);
  const[currentPage,setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [nid, setNid] = useState("");
  const [disable, setDisable] = useState(true);

  let prevClass = "page-item", nextClass = "page-item";

  useEffect(()=>{
    
      console.log(Cookie.get('userSecret'));      
      axios.get("http://localhost:8070/users/allUsers?page=1&limit=5", {
        headers: {
          Authorization: Cookie.get('userSecret')
        }
       }).then((res)=>{
            setRequest(res.data.existingUsers);
            setPageCount(res.data.pages);
            setLoading(false);
          }).catch((err)=>{
              alert(err.message);
          })
      

  },[])

  const pages = [];

  

  async function updatePagination(){

    if(currentPage==1){
      prevClass = "page-item disabled";
    }
    if(currentPage==pagecount){
      nextClass = "page-item disabled";
    }

    
    for(let i=1;i<=pagecount;i++){
      if(i===currentPage){
        pages.push(<li className="page-item active"><a className="page-link" onClick={()=>handlePageChange(i)}>{i}</a></li>)
  
      }
      else{
        pages.push(<li className="page-item"><a className="page-link" onClick={()=>handlePageChange(i)}>{i}</a></li>)
      }
  
    }
  }

  updatePagination()

  

  async function handlePageChange(page){

    setLoading(true);

      await axios.get("http://localhost:8070/users/allUsers?page="+page+"&limit=5",{
        headers: {
          Authorization: Cookie.get('userSecret')
        }
       }).then((res)=>{
            setRequest(res.data.existingUsers);
            setCurrentPage(page);
            updatePagination();
            setLoading(false);
          }).catch((err)=>{
              alert(err.message);
           })
  }

  async function handleData(data){
    setEmail(data.email);
    setFirstName(data.firstName);
    setLastName(data.lastName);
    setMobile(data.mobile);
    setDateOfBirth(data.dateOfBirth);
    setNid(data._id)
  }

  async function handleUpdate(id){
    setLoading(true);
    setDisable(true);
    await axios.put("http://localhost:8070/users/"+id,{
      firstName,
      lastName,
      email,
      dateOfBirth,
      mobile
    },{
      headers: {
        Authorization: Cookie.get('userSecret')
      }
     }).then((res)=>{
        setLoading(false);
        Store.addNotification({
          title: "User Updated Successfully",
          message: "User data has been updated successfully",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          type: "info",
          insert: "top",
          container: "top-right",
          
          dismiss: {
            duration: 1500,
            onScreen: true,
            showIcon: true
          },

          width:400
        }); 
        axios.get("http://localhost:8070/users/allUsers?page="+currentPage+"&limit=5",{
          headers: {
            Authorization: Cookie.get('userSecret')
          }
         }).then((res)=>{
            setRequest(res.data.existingUsers);
            setPageCount(res.data.pages);
            setLoading(false);
          }).catch((err)=>{
              alert(err.message);
          })
    }).catch((err)=>{
      alert(err.message);
    })
  }

  async function handleDelete(id){

    

    confirmAlert({
      title: 'Warning!',
      message: 'Are sure you want to delete this note?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            setLoading(true);
            setDisable(true);
            axios.delete("http://localhost:8070/users/"+id,{
              headers: {
                Authorization: Cookie.get('userSecret')
              }
             }).then((res)=>{
                setLoading(false);
                Store.addNotification({
                  title: "User Deleted Successfully",
                  message: "User data has been deleted successfully",
                  animationIn: ["animate__animated", "animate__fadeIn"],
                  animationOut: ["animate__animated", "animate__fadeOut"],
                  type: "danger",
                  insert: "top",
                  container: "top-right",
                  
                  dismiss: {
                    duration: 1500,
                    onScreen: true,
                    showIcon: true
                  },
        
                  width:400
                }); 
                axios.get("http://localhost:8070/users/allUsers?page="+currentPage+"&limit=5",{
                  headers: {
                    Authorization: Cookie.get('userSecret')
                  }
                 }).then((res)=>{
                    setRequest(res.data.existingUsers);
                    setPageCount(res.data.pages);
                    setLoading(false);
                  }).catch((err)=>{
                      alert(err.message);
                  })
            }).catch((err)=>{
              alert(err.message);
            })
          }
        },
        {
          label: 'No',

        }
      ]
    });
   
  }

    return(
        <div style={{ backgroundColor: "white" }}>
        <div className="t-list-head-container">
          <label className="h-text">User List</label>
        </div>

        <LoadingOverlay
            active={loading}
            spinner={<PropagateLoader />}
        >

        <div className="t-list-tb-container">
          
          <table className="t-table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">ID</th>
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
                       <td>{data.email}</td>
                       <td>{data.accountType}</td>
                       <td>{data.status ? ("Registered" ) :  "Pending"}</td>                     
                      

                       <td>
  
                       <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={()=>{handleData(data)}}>
                        View User
                      </button>
  
  
                       </td>
  
                    </tr>
                  
  
             ))}
                </tbody>
          </table>

          <a href="/add-user" class="btn btn-primary">+ Create New User</a>


          

          <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel"> {firstName + " "+lastName+"'s profile"}</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                <div class="row row-space">
                            <div class="col-2" style={{width:"50%"}}>
                                <div class="input-group">
                                    <label class="label">first name</label>
                                    <input class="input--style-4" type="text" name="first_name" 
                                       value={firstName?(firstName):"Not Set"} disabled={disable}
                                       onChange={(e)=>{setFirstName(e.target.value)}}/>
                                  
                                </div>
                            </div>
                            <div class="col-2" style={{width:"50%"}}>
                                <div class="input-group">
                                    <label class="label">last name</label>
                                    <input class="input--style-4" type="text" name="last_name" 
                                       value={lastName?(lastName):"Not Set" } disabled={disable}
                                       onChange={(e)=>{setLastName(e.target.value)}}
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="row row-space">
                            <div class="col-2" style={{width:"50%"}}>
                                <div class="input-group">
                                    <label class="label">Birthday</label> 
                                    <div class="input-group-icon">
                                        <input class="input--style-4 js-datepicker" type="date" name="birthday" 
                                            value={dateOfBirth? (dateOfBirth.substring(0,10)):""} disabled={disable}
                                            onChange={(e)=>{setDateOfBirth(e.target.value)}}
                                        />
                                        <i class="zmdi zmdi-calendar-note input-icon js-btn-calendar"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="col-2" style={{width:"50%"}}>
                                <div class="input-group">
                                    <label class="label">Phone Number</label>
                                    <input class="input--style-4" type="text" name="phone" 
                                        value={mobile?(mobile):"Not Set"} disabled={disable}
                                        onChange={(e)=>{setMobile(e.target.value)}}
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="input-group">
                                <label class="label">E-mail Address</label>
                                <input class="input--style-4" type="email" name="email" disabled={disable} 
                                    value={email} 
                                    onChange={(e)=>{setEmail(e.target.value)}}                                    
                                />
                        </div>
                </div>
                <div class="modal-footer">
                <button className="btn btn-danger" data-bs-dismiss="modal" onClick={()=>handleDelete(nid)}>
                            <i className= "fas fa-trash-alt"></i>&nbsp;Delete
                  </button>
                  
                  <button type="button" class="btn btn-info" onClick={()=>setDisable(false)}>Edit</button>
                  <button type="button" class="btn btn-success" data-bs-dismiss="modal" disabled={disable} onClick={()=>handleUpdate(nid)} >Save</button>
                </div>
              </div>
            </div>
          </div>

          


          <nav aria-label="Page navigation example">
            <ul className="pagination justify-content-end">
              <li className={prevClass}>
                <a className="page-link" href="#" tabindex="-1" aria-disabled="true" onClick={()=>handlePageChange(currentPage-1)}>Previous</a>
              </li>
              {pages}
              <li className={nextClass}>
                <a className="page-link" onClick={()=>handlePageChange(currentPage+1)}>Next</a>
              </li>
            </ul>
          </nav>
        </div>

        

        </LoadingOverlay>

        
      </div>
    );
}