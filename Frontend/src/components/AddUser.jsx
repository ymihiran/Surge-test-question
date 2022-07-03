import React, { useState } from "react";
import './styles/login.style.css';


export default function AddUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password);
  };

  return (
    <div>

    <div className="limiter">
		<div className="container-login100">
			<div className="wrap-login100 p-l-110 p-r-110 p-t-62 p-b-33">
				<form className="login100-form validate-form flex-sb flex-w">
					<span className="login100-form-title p-b-53">
						Welcome! <br /> Add new user
					</span>

					
					<div className="p-t-31 p-b-9">
						<span className="txt1">
							E-mail Address
						</span>
					</div>
					<div className="wrap-input100 validate-input" data-validate = "Username is required">
						<input className="input100" type="text" name="username" required/>
						<span className="focus-input100"></span>
					</div>
					
					<div className="p-t-13 p-b-9">
						<span className="txt1">
							Tempory Password
						</span>

					</div>
					<div className="wrap-input100 validate-input" data-validate = "Password is required">
						<input className="input100" type="password" name="pass" required />
						<span className="focus-input100"></span>
					</div>

					<div className="container-login100-form-btn m-t-17">
						<button className="login100-form-btn">
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