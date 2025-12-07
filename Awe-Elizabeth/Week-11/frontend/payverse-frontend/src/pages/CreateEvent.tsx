import { useState } from "react";
import { api } from "../api";
import { EventType } from "../types/Event";

const CreateEvent = () => {
  const [form, setForm] = useState<EventType>({
    title: "",
    description: "",
    eventDate: "",
    location: ""
  });

  const [message, setMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/events", form);
      setMessage("Event created successfully!");
      setForm({ title: "", description: "", eventDate: "", location: "" });
    } catch (err) {
      console.error(err);
      setMessage("Error creating event");
    }
  };

  return (
    <div>
      <h1>Create Event</h1>
      {message && <p>{message}</p>}

      <form onSubmit={submit}>
        <input
          name="title"
          placeholder="Event title"
          value={form.title}
          onChange={handleChange}
          required
        /> <br /><br />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        /> <br /><br />

        <input
          name="eventDate"
          type="datetime-local"
          value={form.eventDate}
          onChange={handleChange}
          required
        /> <br /><br />

        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
          required
        /> <br /><br />

        <button type="submit">Create Event</button>
      </form>
    </div>
  );
};

export default CreateEvent;
