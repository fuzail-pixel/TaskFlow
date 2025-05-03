import TaskDetails from './pages/TaskDetails';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard'; //  Import Dashboard
import Tasks from './pages/Tasks'; //  Import at the top

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/projects" element={<Dashboard />} /> {/* Added projects route */}
        <Route path="/projects/:name/tasks" element={<Tasks />} />
        <Route path="/projects/:projectName/tasks/:taskId" element={<TaskDetails />} />

      </Routes>
    </Router>
  );
}

export default App;
