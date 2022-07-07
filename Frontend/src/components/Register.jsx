import React, { useState } from "react";
import './styles/register.style.css';
import axios from 'axios';
import LoadingOverlay from 'react-loading-overlay';
import PropagateLoader from 'react-spinners/PropagateLoader';
import { Store } from 'react-notifications-component'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import Cookie from "js-cookie";
import { useNavigate } from "react-router-dom";


export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState(Cookie.get('userMail'));
  const [mobile, setMobile] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [rPassword, setRPassword] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();
  const status = true;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if(password === rPassword){ //check if passwords match
        const newUser = {  
            firstName,
            lastName,
            email,
            dateOfBirth,
            mobile,
            status,
            password,
        }

        axios.put("http://localhost:8070/users/register",newUser,{
            headers: {
              Authorization: Cookie.get('userSecret')
            }
           }).then(()=>{
            setLoading(false);
            Store.addNotification({
                title: "Data Saved Successfully",
                message: "Your profile data has been successfully saved",
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
      
                width:300
              }); 

                navigate("/note-list");
        
        }).catch((err)=>{
    
            alert(err);
        })

        
    }
    else{
        setLoading(false);
        Store.addNotification({
            title: "Password Mismatch!",
            message: "New password and confirm password do not match",
            animationIn: ["animate__animated", "animate__fadeIn"],
            animationOut: ["animate__animated", "animate__fadeOut"],
            type: "warning",
            insert: "top",
            container: "top-right",
            
            dismiss: {
              duration: 1500,
              onScreen: true,
              showIcon: true
            },
  
            width:300
          }); 
    }
        
    }

    
    
    

  

  return (
    
    <div>
        

     

    <div class="page-wrapper p-t-130 p-b-100 font-poppins">
        <div class="wrapper wrapper--w680">
        <LoadingOverlay
            active={loading}
            spinner={<PropagateLoader />}
        >
            <div class="card card-4">
                <div class="card-body">
                    <h2 class="title">Registration Form</h2>
                    <form onSubmit={handleSubmit}>
                        <div class="row row-space">
                            <div class="col-2" style={{width:"50%"}}>
                                <div class="input-group">
                                    <label class="label">first name</label>
                                    <input class="input--style-4" type="text" name="first_name" 
                                        onChange={(e)=> setFirstName(e.target.value)} 
                                    />
                                </div>
                            </div>
                            <div class="col-2" style={{width:"50%"}}>
                                <div class="input-group">
                                    <label class="label">last name</label>
                                    <input class="input--style-4" type="text" name="last_name" 
                                        onChange={(e)=> setLastName(e.target.value)} 
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
                                            onChange={(e)=> setDateOfBirth(e.target.value)} 
                                        />
                                        <i class="zmdi zmdi-calendar-note input-icon js-btn-calendar"></i>
                                    </div>
                                </div>
                            </div>
                            <div class="col-2" style={{width:"50%"}}>
                                <div class="input-group">
                                    <label class="label">Phone Number</label>
                                    <input class="input--style-4" type="text" name="phone" 
                                        onChange={(e)=> setMobile(e.target.value)} 
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="input-group">
                                <label class="label">E-mail Address</label>
                                <input class="input--style-4" type="email" name="email" disabled 
                                    value={email}
                                    onChange={(e)=> setEmail(e.target.value)} 
                                />
                        </div>

                        <div class="row row-space">
                            <div class="col-2" style={{width:"50%"}}>
                                <div class="input-group">
                                    <label class="label">New Password</label>
                                    <input class="input--style-4" type="password" name="password" 
                                        onChange={(e)=> setPassword(e.target.value)} 
                                    />
                                </div>
                            </div>
                            <div class="col-2" style={{width:"50%"}}>
                                <div class="input-group">
                                    <label class="label">Confirm Password</label>
                                    <input class="input--style-4" type="password" name="rPassword" 
                                        onChange={(e)=> setRPassword(e.target.value)} 
                                    />
                                </div>
                            </div>
                        </div>
                       
                        <div className="container-login100-form-btn m-t-17">
						<button className="login100-form-btn">
							Register
						</button>
					</div>
                    </form>
                </div>
            </div>
            </LoadingOverlay>  
        </div>
    </div>
    

    </div>

   
    

  );
  
}