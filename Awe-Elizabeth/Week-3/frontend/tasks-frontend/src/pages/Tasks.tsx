import React, { useEffect, useState } from "react";
import { searchTasks } from "../api/tasksApi.ts";
import Pagination from "../components/Pagination";
import Navbar from "../components/Navbar.tsx";

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleSearch = async () => {
    const res = await searchTasks( query, page, 1);
    
    setTasks(res.resut.data);
    setTotalPages(res.resut.totalPages);
  };

  useEffect(() => {
    handleSearch();
  }, [page]);

  return (
    <>
     <Navbar></Navbar>
    <div className="p-6">
      <h1 className="text-2xl mb-4 font-bold">Tasks</h1>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search tasks..."
        className="border px-2 py-1 mr-2"
      />
      <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-1 rounded">
        Search
      </button>

      <ul className="mt-4">
        {tasks.map((task: any) => (
            <li key={task._id} className="border-b py-2">{task.title}
                <p className="text-0.5s py-2">{task.description}</p>
                <p className="text-0.5s py-2">{task.dueTime}</p>
            </li>
        ))}
      </ul>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
    </>
   
  );
};

export default Tasks;
