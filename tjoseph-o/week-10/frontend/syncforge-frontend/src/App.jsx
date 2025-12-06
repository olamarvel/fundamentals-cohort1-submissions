import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import TaskList from './pages/TaskList';
import CreateTask from './pages/CreateTask';
import TaskStats from './pages/TaskStats';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<TaskList />} />
            <Route path="/create" element={<CreateTask />} />
            <Route path="/stats" element={<TaskStats />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
