/* Importation des composants */
import "../src/app.css";
import HeaderIn from "./components/Header-in";
import HeaderOut from "./components/Header-out";
import Footer from "./components/Footer";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
import Post from "./components/Post";
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from "react-router-dom";

// Fonction déconnecté
function Logout() {
  return (
    <>
      <HeaderOut />
      <main className="layout">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

// Fonction connecté
function Connected() {
  return (
    <>
      <HeaderIn />
      <main className="layout">
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

/* Routes des composants */
const App = () => {

  return (
    <div className="container is-fluid p-0">
      <Router>
        <Routes>
          <Route path="/*" element={<Logout />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<Navigate to="/Login" replace />} />
          </Route>
          <Route path="/*" element={<Connected />}>
            <Route path="home" element={<Home />} />
            <Route path="profile/:id" element={<Profile />} />
            <Route path="post/:id" element={<Post />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
