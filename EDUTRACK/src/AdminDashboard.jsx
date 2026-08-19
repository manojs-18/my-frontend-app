import { useNavigate } from "react-router-dom";
import AdminMenu from "./AdminMenu";
import api from "./apiService";

function AdminDashboard() {

  const navigate = useNavigate() ; 
  // Add new subject
  const handleAddSubject = () => {
    const subjectName = prompt("Enter Subject Name:");
    if (!subjectName || subjectName.trim() === "") {
      alert("Subject name cannot be empty!");
      return;
    }

    subjectAPI.addSubject({ name: subjectName })
      .then(() => {
        alert("Subject added successfully!");
          navigate('/all-subject')
      })
      .catch((err) => {
        console.error("Error adding subject:", err);
        alert("Failed to add subject.");
      });
  };



  // ✅ NOW inside component
  const adminFunctions = [
    {
      title: "Add User",
      description: "Create a new user account for the system.",
      href: "/add-user",
      icon: "👤",
    },
    {
      title: "All User",
      description: "View and manage all users.",
      href: "/all-users",
      icon: "👥",
    },
    {
      title: "Manage User",
      description: "Delete and update user information. Role management.",
      href: "/all-users",
      icon: "🛠️"
    },
    {
      title: "Add Subject",
      description: "Add a new subject to the curriculum.",
      onClick: handleAddSubject, // ✅ now works
      icon: "📖",
    },
    {
      title: "All Subject",
      description: "View and manage all subjects.",
      href: "/all-subject",
      icon: "📚",
    },
    {
      title: "View Attendance",
      description: "Check and analyze attendance records.",
      href: "/view-attendance",
      icon: "📊",
    },
  ];
  // Fetch all subjects
  const fetchSubjects = () => {
    subjectAPI.getAllSubjects()
      .then((response) => setSubjects(response.data))
      .catch((err) => console.error("Error fetching subjects:", err));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200">
      <AdminMenu />
      <div className="max-w-6xl mx-auto py-12 px-4">
        <h2 className="text-2xl font-bold text-blue-700 mb-8 text-center">
          Admin Functionalities
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {adminFunctions.map((func, idx) => (
            <div
              key={idx}
              onClick={
                func.onClick
                  ? func.onClick
                  : () => (window.location.href = func.href)
              }
              className="cursor-pointer bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center hover:shadow-2xl hover:-translate-y-1 transition transform duration-200 group"
            >
              <div className="text-5xl mb-4 group-hover:scale-110 transition">
                {func.icon}
              </div>
              <h3 className="text-lg font-bold text-blue-600 mb-2">
                {func.title}
              </h3>
              <p className="text-gray-600 text-sm">{func.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

  export const subjectAPI = {
    addSubject: (subjectData) => api.post('/subject/add-subject/', subjectData),
   
  };