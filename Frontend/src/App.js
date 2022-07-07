import { BrowserRouter as Router, Route,Routes } from "react-router-dom";
import { ReactNotifications } from "react-notifications-component";

import Login from './components/Login';
import Register from "./components/Register";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";
import NoteList from "./components/NotesList";
import Header from "./components/Header";


function App() {
  return (
    
    <Router>
      <ReactNotifications />
      <Header />
      <Routes>
        <Route path='/' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/add-user' element={<AddUser />}/>
        <Route path='/user-list' element={<UserList />}/>
        <Route path='/note-list' element={<NoteList />}/>
      </Routes>
    </Router>
  
  );
}

export default App;
