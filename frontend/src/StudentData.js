import { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

function StudentData() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", DOB: "", password: "" });
  const [selectedStudent, setSelectedStudent] = useState("");
  const [courseName, setCourseName] = useState("");

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleAddStudent(e) 
  {e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/add-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Failed to add student");
      alert("Student added!");
      setFormData({ name: "", email: "", dob: "", password: "" });
      fetchStudents();} catch (err) {console.error(err); alert("Error adding student");}}

  async function handleAssignCourse(e) {
    e.preventDefault();
    if (!selectedStudent || !courseName) return alert("Select student and course");
    try {
      const res = await fetch("http://localhost:5000/api/assign-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: selectedStudent, courseName }),
      });
      if (!res.ok) throw new Error("Failed to assign course");
      alert("Course assigned!");
      setCourseName("");
      setSelectedStudent("");
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  }

  const filteredStudents = students.filter((s) =>
    s.Name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white flex flex-col items-center gap-10">
      <h1 className="text-4xl font-bold text-center text-blue-400">Student Management</h1>

      {/* Addition of Student */}
      <div className="bg-gray-800 p-6 rounded shadow-lg w-full max-w-xl">
        <h2 className="font-semibold text-xl mb-4">Add New Student</h2>
        <form onSubmit={handleAddStudent} className="flex flex-col gap-3">
          <input type="text" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="p-2 rounded bg-gray-700 text-white" required />
          <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="p-2 rounded bg-gray-700 text-white" required />
          <input type="date" value={formData.dob} onChange={(e) => setFormData({ ...formData, dob: e.target.value })} className="p-2 rounded bg-gray-700 text-white" required />
          <input type="password" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="p-2 rounded bg-gray-700 text-white" required />
          <button type="submit" className="bg-green-600 py-2 rounded hover:bg-green-500">Add Student</button>
        </form>
      </div>

      {/* Assign Course */}
      <div className="bg-gray-800 p-6 rounded shadow-lg w-full max-w-xl">
        <h2 className="font-semibold text-xl mb-4">Assign Course</h2>
        <form onSubmit={handleAssignCourse} className="flex flex-col gap-3">
          <select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} className="p-2 rounded bg-gray-700 text-white">
            <option value="">Select Student</option>
            {students.map((s) => <option key={s.S_id} value={s.S_id}>{s.Name}</option>)}
          </select>

          <input type="text" placeholder="Course Name" value={courseName} onChange={(e) => setCourseName(e.target.value)} className="p-2 rounded bg-gray-700 text-white" required />
          <button type="submit" className="bg-blue-600 py-2 rounded hover:bg-blue-500">Assign Course</button>
        </form>
      </div>

      {/* List of student with a Pie Chart*/}
        <div className="grid grid-cols-20 md:grid-cols-1 lg:grid-cols-3 gap-6">
          <h1 className=" "></h1>
        <h2 className="font-bold text-center text-2xl mb-4">Students List</h2>
        <input type="text" placeholder="Search students" value={search} onChange={(e) => setSearch(e.target.value)} className="p-2 rounded w-full mb-4 bg-gray-700 text-white" />
        {filteredStudents.map((s) => 
        {
          const total = s.Attendance?.length || 1;
          const present = s.Attendance?.filter((a) => a.Status === "Present").length || 0;
          const absent = total - present;

          const pieData = {
            labels: ["Present", "Absent"],
            datasets: [{ data: [present, absent], backgroundColor: ["#22c55e", "#f59e0b"] }],
          };
           



          return (
            <div key={s.S_id} className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
              <p className="font-semibold">{s.Name}</p>
              <p className="text-gray-300 text-sm">Courses: {s.Courses?.join(", ") || "None"}</p>
              <div className="w-48 mt-2">
                <Pie data={pieData} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StudentData;
