import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import EventsList from "./pages/EventList";
import CreateEvent from "./pages/CreateEvent";

function App() {
  return (
    <BrowserRouter>
      <nav style={{ display: "flex", gap: 20, marginBottom: 20 }}>
        <Link to="/">Events</Link>
        <Link to="/create">Create Event</Link>
      </nav>

      <Routes>
        <Route path="/" element={<EventsList />} />
        <Route path="/create" element={<CreateEvent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
