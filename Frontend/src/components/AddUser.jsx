import React, { useState } from "react";
import './styles/login.style.css';
import { Store } from 'react-notifications-component'; 
import axios from 'axios';
import LoadingOverlay from 'react-loading-overlay';
import PropagateLoader from 'react-spinners/PropagateLoader';


export default function AddUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

	const newUser = {  
		email,
		password,
	}

	axios.post("http://localhost:8070/user/",newUser).then(()=>{
            setLoading(false);
            Store.addNotification({
                title: "User Added Successfully",
                message: "Account creation successfull",
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
        
        }).catch((err)=>{
    
            alert(err);
        })
    
  };

  return (
    <div>

    <div className="limiter">
		<div className="container-login100">
			<div className="wrap-login100 p-l-110 p-r-110 p-t-62 p-b-33">
				<form className="login100-form validate-form flex-sb flex-w" onSubmit={handleSubmit}>
					<span className="login100-form-title p-b-53">
						Welcome! <br /> Add new user
					</span>

					
					<div className="p-t-31 p-b-9">
						<span className="txt1">
							E-mail Address
						</span>
					</div>
					<div className="wrap-input100 validate-input" data-validate = "Username is required">
						<input className="input100" type="email" name="username" required
							onChange={(e) => setEmail(e.target.value)}
						/>
						<span className="focus-input100"></span>
					</div>
					
					<div className="p-t-13 p-b-9">
						<span className="txt1">
							Tempory Password
						</span>

					</div>
					<div className="wrap-input100 validate-input" data-validate = "Password is required">
						<input className="input100" type="password" name="pass" required 
							onChange={(e) => setPassword(e.target.value)}
						/>
						<span className="focus-input100"></span>
					</div>

					<div className="container-login100-form-btn m-t-17">
						<button className="login100-form-btn" onClick={()=>handleSubmit()}>
							Create Account
						</button>
					</div>

					<div className="w-full text-center p-t-55">
						<span className="txt2">
							Check user status here : 
						</span>

						<a href="/user-list" className="txt2 bo1">
							user list
						</a>
					</div>
				</form>
			</div>
		</div>
	</div>
	

	<div id="dropDownSelect1"></div>

    </div>

  );
}