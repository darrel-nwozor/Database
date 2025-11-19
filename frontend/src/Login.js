import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Student");
  const navigate = useNavigate();

  const handleLogin = async (e) => { e.preventDefault();
    if (!email || !password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const result = await res.json();
      if (!res.ok) {
        alert(result.error || "Login failed");
        return;
      }
      alert(`Login successful as ${role}!`);

      if (role === "Student") navigate("/student-dashboard");
      else if (role === "Teacher") navigate("/teacher-dashboard");
      else navigate("/Parent-dashboard");
    } catch (err) {
      console.error("Login request error:", err);
      alert("Server error. Please try again.");
    }
  };

  return (
    <div className="max-h-full flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow-lg p-10 mt-30 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <input type="email"placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"required/>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-white"
          >
            <option value="Student">Student</option>
            <option value="Teacher">Teacher</option>
            <option value="Admin">Parent</option>
          </select>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg font-semibold transition">
            Login
          </button>
        </form>
        <p className="text-center mt-4 text-gray-500">
          Don't have an account? <a href="/signup" className="text-blue-500">Sign Up</a>

        </p>
      </div>
    </div>
  );
}

export default Login;
