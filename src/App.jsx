
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useState } from "react";
import Login from "./components/login";
import Dashboard from "./components/Dashboard";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("access_token"))
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={
            loggedIn ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login onLogin={() => setLoggedIn(true)} />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            loggedIn ? (
              <Dashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to={loggedIn ? "/dashboard" : "/login"}
              replace
            />
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
