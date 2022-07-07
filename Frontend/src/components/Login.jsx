import React, { useState } from "react";
import './styles/login.style.css';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";	
import Cookie from "js-cookie";
import LoadingOverlay from 'react-loading-overlay';
import PropagateLoader from 'react-spinners/PropagateLoader';
import { Store } from 'react-notifications-component'; 


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
	setLoading(true);

	try {
		const user = {email, password};

		const promise = await axios.post("http://localhost:8070/users/login/",user).then((res)=>{


            if(res.data.msg == "Login Success"){
				setCookie('LoggedUser', res.data.data, { path: '/' });
				Cookie.set('userMail', res.data.data.email, { path: '/' });
				Cookie.set('userRole', res.data.data.accountType, { path: '/' });
				Cookie.set('userStatus', res.data.data.status, { path: '/' });
				Cookie.set('userSecret', res.data.token, { path: '/' });
                setLoading(false);
				Store.addNotification({
					title: "Successfully Logged In",
					message: "Your have successfully logged in",
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
				
				if(res.data.data.accountType=="Admin"){
					navigate("/user-list");
				}else if(res.data.data.status==false){
					navigate("/register");
				}
				
				else {
					navigate("/note-list");
				}

				

            }
            else{
                setLoading(false);
				Store.addNotification({
					title: "Login Failed!",
					message: "Please check your username and password",
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
		
					width:300
				});
            }
        }).catch((err)=>{
            alert(err);
        });
  
	  } catch (error) {
		Store.addNotification({
			title: "Login Failed!",
			message: "Please check your username and password",
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

			width:300
		});
	  }
	};
	


  

  return (
    <div>

<div className="limiter">
		<div className="container-login100">
			<div className="wrap-login100 p-l-110 p-r-110 p-t-62 p-b-33">
				<LoadingOverlay
					active={loading}
					spinner={<PropagateLoader />}
				>
				<form className="login100-form validate-form flex-sb flex-w" onSubmit={handleSubmit}>
					<span className="login100-form-title p-b-53">
						Welcome! <br /> Log in here
					</span>

					
					<div className="p-t-31 p-b-9">
						<span className="txt1">
							E-mail Address
						</span>
					</div>
					<div className="wrap-input100 validate-input" data-validate = "Username is required">
						<input className="input100" type="text" name="username" required
							onChange={(e)=> setEmail(e.target.value)} 
						/>
						<span className="focus-input100"></span>
					</div>
					
					<div className="p-t-13 p-b-9">
						<span className="txt1">
							Password
						</span>

						<a href="#" className="txt2 bo1 m-l-5">
							Forgot?
						</a>
					</div>
					<div className="wrap-input100 validate-input" data-validate = "Password is required">
						<input className="input100" type="password" name="pass" required 
							onChange={(e)=> setPassword(e.target.value)} 
						/>
						<span className="focus-input100"></span>
					</div>

					<div className="container-login100-form-btn m-t-17">
						<button className="login100-form-btn" type="submit">
							Sign In
						</button>
					</div>

					<div className="w-full text-center p-t-55">
						<span className="txt2">
							Not a member?
						</span>

						<a href="/Register" className="txt2 bo1">
							Sign up now
						</a>
					</div>
				</form>
				</LoadingOverlay>
			</div>
		</div>
	</div>
	

	<div id="dropDownSelect1"></div>

    </div>

  );
}