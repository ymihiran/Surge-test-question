import React, { useState,useEffect } from "react";
import './styles/notes.style.css';
import axios from 'axios';
import LoadingOverlay from 'react-loading-overlay';
import PropagateLoader from 'react-spinners/PropagateLoader';

export default function NoteList() {

  const[request,setRequest] = useState([]);
  const[pagecount,setPageCount] = useState(0);
  const[currentPage,setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  let prevClass = "page-item ", nextClass = "page-item ";

  useEffect(()=>{
          
      axios.get("http://localhost:8070/note/?page=1&limit=5").then((res)=>{
            setRequest(res.data.existingNotes);
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
      await axios.get("http://localhost:8070/note/?page="+page+"&limit=2").then((res)=>{
            setRequest(res.data.existingNotes);
            setCurrentPage(page);
            updatePagination();
            setLoading(false);
          }).catch((err)=>{
              alert(err.message);
           })
  }

    return(
        <div style={{ backgroundColor: "white" }}>
        <div className="t-list-head-container">
          <label className="h-text">My Notes</label>
        </div>

        <div className="t-list-tb-container">
          
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

        
      </div>
    );
}