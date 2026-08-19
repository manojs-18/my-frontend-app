import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";

import AddStudent from "./AddStudent";
import AddUser from "./AddUser";
import AdminDashboard from "./AdminDashboard";
import AllStudents from "./AllStudents";
import AllSubject from "./AllSubject";
import AllUser from "./AllUser";
import "./App.css";
import FacultyDashboard from "./FacultyDashboard";
import Footer from "./Footer";
import Login from "./Login";
import MarkAttendance from "./MarkAttendance";
import Profile from "./Profile";
import UpdateUser from "./UpdateUser";
import ViewAttendance from "./ViewAttendance";
import Welcome from "./Welcome";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />

        <Route path="/admin-dashboard" element={
          <ProtectedRoute><AdminDashboard /></ProtectedRoute>
        } />

        <Route path="/faculty-dashboard" element={
          <ProtectedRoute><FacultyDashboard /></ProtectedRoute>
        } />

        <Route path="/add-user" element={
          <ProtectedRoute><AddUser /></ProtectedRoute>
        } />

        <Route path="/all-users" element={
          <ProtectedRoute><AllUser /></ProtectedRoute>
        } />

        <Route path="/update-user/:username" element={
          <ProtectedRoute><UpdateUser /></ProtectedRoute>
        } />

        <Route path="/all-subject" element={
          <ProtectedRoute><AllSubject /></ProtectedRoute>
        } />

        <Route path="/my-profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />

        <Route path="/add-student" element={
          <ProtectedRoute><AddStudent /></ProtectedRoute>
        } />

        <Route path="/all-students" element={
          <ProtectedRoute><AllStudents /></ProtectedRoute>
        } />

        <Route path="/view-attendance" element={
          <ProtectedRoute><ViewAttendance /></ProtectedRoute>
        } />

        <Route path="/mark-attendance" element={
          <ProtectedRoute><MarkAttendance /></ProtectedRoute>
        } />
      </Routes>

      <Footer />
    </>
  );
}

export default App;