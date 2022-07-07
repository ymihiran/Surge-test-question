import React, { useState,useEffect } from "react";
import './styles/notes.style.css';
import axios from 'axios';
import LoadingOverlay from 'react-loading-overlay';
import PropagateLoader from 'react-spinners/PropagateLoader';
import { confirmAlert } from 'react-confirm-alert';
import { Store } from 'react-notifications-component'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import Cookie from "js-cookie";

export default function NoteList() {

  const[request,setRequest] = useState([]);
  const[pagecount,setPageCount] = useState(0);
  const[currentPage,setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState(Cookie.get('userMail'));
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [enable, setEnable] = useState(true);
  const [nid, setNid] = useState("");
  
  

  let prevClass = "page-item ", nextClass = "page-item ";

  useEffect(()=>{
          
      axios.get("http://localhost:8070/note/"+email +"?page=1&limit=5",{
        headers: {
          Authorization: Cookie.get('userSecret')
        }
       }).then((res)=>{
            setRequest(res.data.existingNotes);
            setPageCount(res.data.pages);
            setLoading(false);
          }).catch((err)=>{
              alert(err.message);
          })
      

  },[])

  const pages = [];

  

  async function updatePagination(){

    if(currentPage===1){
      prevClass = "page-item disabled";
    }
    if(currentPage===pagecount){
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
      await axios.get("http://localhost:8070/note/"+email +"?page="+page+"&limit=5",{
        headers: {
          Authorization: Cookie.get('userSecret')
        }
       }).then((res)=>{
            setRequest(res.data.existingNotes);
            setCurrentPage(page);
            updatePagination();
            setLoading(false);
          }).catch((err)=>{
              alert(err.message);
           })
  }


  async function handleSubmit(){

    setLoading(true);
    setEnable(true);
    await axios.post("http://localhost:8070/note/",{
      email,
      title,
      note
    },{
      headers: {
        Authorization: Cookie.get('userSecret')
      }
     }).then((res)=>{
        setLoading(false);
        Store.addNotification({
          title: "Note Saved Successfully",
          message: "Your Note has been saved successfully",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          type: "success",
          insert: "top",
          container: "top-right",
          
          dismiss: {
            duration: 1500,
            onScreen: true,
            showIcon: true
          },

          width:400
        }); 
        axios.get("http://localhost:8070/note/"+email+"?page=1&limit=5",{
          headers: {
            Authorization: Cookie.get('userSecret')
          }
         }).then((res)=>{
            setRequest(res.data.existingNotes);
            setPageCount(res.data.pages);
            setLoading(false);
          }).catch((err)=>{
              alert(err.message);
          })
    }).catch((err)=>{
      alert(err.message);
    })
  }

  async function handleData(data){
    setEmail(data.email);
    setTitle(data.title);
    setNote(data.note);
    setNid(data._id)
  }

  async function handleUpdate(id){
    setLoading(true);
    setEnable(true);
    await axios.put("http://localhost:8070/note/"+id,{
      email,
      title,
      note
    },{
      headers: {
        Authorization: Cookie.get('userSecret')
      }
     }).then((res)=>{
        setLoading(false);
        Store.addNotification({
          title: "Note Updated Successfully",
          message: "Your Note has been updated successfully",
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
        axios.get("http://localhost:8070/note/"+email +"?page="+currentPage+"&limit=5",{
          headers: {
            Authorization: Cookie.get('userSecret')
          }
         }).then((res)=>{
            setRequest(res.data.existingNotes);
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
            setEnable(true);
            axios.delete("http://localhost:8070/note/"+id,{
              headers: {
                Authorization: Cookie.get('userSecret')
              }
             }).then((res)=>{
                setLoading(false);
                Store.addNotification({
                  title: "Note Deleted Successfully",
                  message: "Your Note has been deleted successfully",
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
                axios.get("http://localhost:8070/note/"+email +"?page="+currentPage+"&limit=5",{
                  headers: {
                    Authorization: Cookie.get('userSecret')
                  }
                 }).then((res)=>{
                    setRequest(res.data.existingNotes);
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
          <label className="h-text">My Notes</label>
        </div>

        <div className="t-list-tb-container">
        <LoadingOverlay
            active={loading}
            spinner={<PropagateLoader />}
        >
          
          <table className="t-table table-striped table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Title</th>
                <th scope="col">Note</th>
                <th scope="col">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
            {request.map((data,index)=>(
                    
                    <tr key={index}>
                       <th scope="row">{index+1}</th>
                       <td>{data.title}</td>
                       <td>{ data.note.length>50 ?(data.note.substring(0, 50)+"..."):(data.note)}</td>
                          
                       <td>
  
                       <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#viewNote" onClick={()=>handleData(data)}>
                        View Note
                      </button>
                           
                       </td>
  
                    </tr>
                  
  
             ))}
                </tbody>
          </table>
        </LoadingOverlay>

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

         
          <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            + Add New Note
          </button>

          <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <LoadingOverlay
              active={loading}
              spinner={<PropagateLoader />}
            >
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">Add New Note</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row row-space">
    
                                    <div class="input-group">
                                        <label class="label">Title : </label> &nbsp;
                                        <input class="form-control" type="text" name="first_name" 
                                          onChange={(e)=>setTitle(e.target.value)}
                                        />
                                       </div>

      
                                    <div class="input-group">
                                        <label class="label">Note : </label>  &nbsp;
                                        <textarea class="form-control" id="exampleFormControlTextarea1" rows="3"
                                          onChange={(e)=>setNote(e.target.value)}
                                        />
                                    </div>

                            </div>
                            
                    </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-success" data-bs-dismiss="modal" onClick={handleSubmit}>Save</button>
                </div>
              </div>
            </div>
            </LoadingOverlay>
          </div>


          <div class="modal fade" id="viewNote" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <LoadingOverlay
              active={loading}
              spinner={<PropagateLoader />}
            >
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel"> {title}</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" onClick={()=>setEnable(true)} aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row row-space">
    
                                    <div class="input-group">
                                        <label class="label">Title : </label> &nbsp;
                                        <input disabled={enable} class="form-control" type="text" name="first_name" 
                                          value={title}
                                          onChange={(e)=>setTitle(e.target.value)}
                                        />
                                       </div>

      
                                    <div class="input-group">
                                        <label class="label">Note : </label>  &nbsp;
                                        <textarea disabled={enable} class="form-control" id="exampleFormControlTextarea1" rows="3"
                                          value={note}
                                          onChange={(e)=>setNote(e.target.value)}
                                        />
                                    </div>

                            </div>
                            
                    </div>
                <div class="modal-footer">

                  <button className="btn btn-danger" data-bs-dismiss="modal" onClick={()=>handleDelete(nid)}>
                            <i className= "fas fa-trash-alt"></i>&nbsp;Delete
                  </button>
                  
                  <button type="button" class="btn btn-info" onClick={()=>setEnable(false)}>Edit</button>
                  <button type="button" class="btn btn-success" data-bs-dismiss="modal" disabled={enable} onClick={()=>handleUpdate(nid)} >Save</button>
                  
                </div>
              </div>
            </div>
            </LoadingOverlay>
          </div>

        </div>

        
      </div>
    );
}