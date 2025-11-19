import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {Chart as ChartJS, CategoryScale,LinearScale, BarElement, Title, Tooltip,Legend,} from "chart.js";
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Home() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState("Present");
  const [lessonNames, setLessonNames] = useState({}); 

  useEffect(() => {
    fetchStudents();
  }, []);

  async function fetchStudents() {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setStudents(
        data.map((s) => ({...s, Courses: s.Courses || [], Attendance: s.Attendance || [], })));
    } catch (err) {
      console.error(err);
      alert("Error fetching students");
    } finally {
      setLoading(false);
    }
  }

  async function markAttendance(studentId) {
    const lessonName = lessonNames[studentId];
    if (!lessonName) return alert("Enter a lesson name.");

    try {
      const res = await fetch("http://localhost:5000/api/mark-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId, lessonName, status: attendanceStatus }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed marking attendance");

      setStudents((prev) =>
        prev.map((s) =>
          s.S_id === studentId
            ? {...s, Attendance: [...s.Attendance, { Lesson: lessonName, Status: attendanceStatus }],}: s
        )
      );

      setLessonNames((prev) => ({ ...prev, [studentId]: "" }));
    } catch (err) {
      console.error(err);
      alert("Error marking attendance: " + err.message);
    }
  }

  const filteredStudents = students.filter((s) =>
    s.Name.toLowerCase().includes(search.toLowerCase())
  );

  // Data Chart 
  const chartData = {
    labels: filteredStudents.map((s) => s.Name),
    datasets: [
      {
        label: "Attendance %",
        data: filteredStudents.map((s) => {
          const total = s.Attendance.length;
          if (total === 0) return 0;
          const present = s.Attendance.filter((a) => a.Status === "Present").length;
          return Math.round((present / total) * 100);
        }),
        backgroundColor: "rgba(34,197,94,0.7)",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-4 text-center">Student Dashboard</h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-800 text-white w-full max-w-md"
        />
      </div>

      {loading ? (
        <p>Loading students...</p>
      ) : filteredStudents.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <>
          {/* Attendance Chart */}
          <div className="bg-gray-800 p-6 rounded-lg mb-8 shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-center text-green-400">
              Attendance Overview
            </h2>
            <Bar
              data={chartData}
              options={{ responsive: true,  plugins: { legend: { display: false } }, animation: { duration: 500 }, }}
            />
          </div>

          {/* Student Grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((s) => (
              <div
                key={s.S_id}
                className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700"
              >
                <h3 className="text-xl font-semibold text-blue-400">{s.Name}</h3>
                <p className="text-gray-300"><strong>Email:</strong> {s.Email}</p>
                <p className="text-gray-300"><strong>DOB:</strong> {s.DateOfBirth}</p>

                <h4 className="mt-3 font-semibold text-green-400">Courses</h4>
                {s.Courses.length > 0 ? (
                  <ul className="list-disc list-inside text-gray-300">
                    {s.Courses.map((c, idx) => <li key={idx}>{c}</li>)}
                  </ul>
                ) : (
                  <p className="text-gray-500">No courses assigned</p>
                )}

                <div className="mt-3">
                  <h4 className="font-semibold text-yellow-400 mb-1">Mark Attendance</h4>
                  <div className="flex gap-2">
                    <select
                      value={lessonNames[s.S_id] || ""}
                      onChange={(e) => setLessonNames((prev) => ({ ...prev, [s.S_id]: e.target.value }))
                      }
                      className="p-1 rounded bg-gray-700 text-white text-sm"
                    >
                      <option>Software Deevelopment</option>
                      <option>Music</option>
                      <option>Games</option>
                      <option>Games Course</option>
                    </select>

                    <select
                      value={attendanceStatus}
                      onChange={(e) => setAttendanceStatus(e.target.value)}
                      className="p-1 rounded bg-gray-700 text-white text-sm"
                    >
                      <option>Present</option>
                      <option>Absent</option>
                    </select>
                    <button
                      onClick={() => markAttendance(s.S_id)}
                      className="bg-yellow-600 px-3 py-1 rounded hover:bg-yellow-500 text-sm"
                    >
                      Mark
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
