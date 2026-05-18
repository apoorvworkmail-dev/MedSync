import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/dashboard";
import NotFound from "./pages/NotFound";
import Appointments from "./pages/Appointments";
import Doctors from "./pages/Doctors";
import Patients from "./pages/Patients";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";

const protectedRoute = (page) => (
  <ProtectedRoute>
    {page}
  </ProtectedRoute>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={protectedRoute(<Dashboard />)} />
        <Route path="/appointments" element={protectedRoute(<Appointments />)} />
        <Route path="/doctors" element={protectedRoute(<Doctors />)} />
        <Route path="/patients" element={protectedRoute(<Patients />)} />
        <Route path="/reports" element={protectedRoute(<Reports />)} />
        <Route path="/settings" element={protectedRoute(<Settings />)} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
