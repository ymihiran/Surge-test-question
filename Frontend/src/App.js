import { BrowserRouter as Router, Route,Routes } from "react-router-dom";
import Login from './components/Login';
import Register from "./components/Register";
import StudentNotes from "./components/StudentNotes";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";
import NoteList from "./components/NotesList";
import CreateNote from "./components/CreateNote";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/my-notes' element={<StudentNotes />}/>
        <Route path='/add-user' element={<AddUser />}/>
        <Route path='/user-list' element={<UserList />}/>
        <Route path='/note-list' element={<NoteList />}/>
      </Routes>
    </Router>
  
  );
}

export default App;
