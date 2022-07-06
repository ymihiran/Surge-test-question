import React, { useState,useEffect } from "react";
import axios from 'axios';
import LoadingOverlay from 'react-loading-overlay';
import PropagateLoader from 'react-spinners/PropagateLoader';
import { Store } from 'react-notifications-component'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 


export default function Header() {

  

    return(
      <nav class="navbar navbar-light bg-light">
      <div class="container-fluid">
        <a class="navbar-brand">NotesPal</a>
        <form class="d-flex">
          <button class="btn btn-outline-primary" type="submit">Log In</button>
        </form>
      </div>
    </nav>
    );
}