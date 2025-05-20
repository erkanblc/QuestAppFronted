import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import User from './components/User/User';
import Post from './components/Post/Post';
import Auth from './components/Auth/Auth';

function App() {
  const currentUser = localStorage.getItem("currentUser");

  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/users/:userId" element={<User />} />
          <Route path="/posts" element={<Post />} />
          <Route
            path="/auth"
            element={
              currentUser !== null ? <Navigate to="/" /> : <Auth />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;