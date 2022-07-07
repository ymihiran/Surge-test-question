import React, { useState,useEffect } from "react";
import 'react-confirm-alert/src/react-confirm-alert.css'; 
import Cookie from "js-cookie";
import {useNavigate } from "react-router-dom";



export default function Header() {


  const navigation = useNavigate();



  const handleLogout = () => {
    Cookie.remove('userMail');
    Cookie.remove('userSecret');
    Cookie.remove('userRole');
    Cookie.remove('userStatus');
    Cookie.remove('LoggedUser');

    navigation("/");
  }

 
  

  

    return(
      <nav class="navbar navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand">NotesPal</a>
        <form class="d-flex" onSubmit={handleLogout}>
          <button class="btn btn-outline-primary" type="submit">{Cookie.get('userMail')?("Log out"):"Log in"}</button>
        </form>
      </div>
    </nav>
    );
}