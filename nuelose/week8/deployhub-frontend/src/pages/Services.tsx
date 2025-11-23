import { useEffect, useState } from "react";
import api from "../lib/api";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { Service } from "../types";

export default function Services() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", url: "", version: "1.0.0" });
  const [editingService, setEditingService] = useState<Service | null>(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get("/services");
      setServices(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const create = async () => {
    try {
      await api.post("/services", form);
      setForm({ name: "", url: "", version: "1.0.0" });
      setShowForm(false);
      fetch();
    } catch (err) {
      console.error(err);
    }
  };

  const update = async () => {
    if (!editingService) return;

    try {
      await api.put(
        `/services/${encodeURIComponent(editingService.name)}`,
        form
      );
      setEditingService(null);
      setForm({ name: "", url: "", version: "1.0.0" });
      setShowForm(false);
      fetch();
    } catch (err) {
      console.error(err);
    }
  };

  const remove = async (name: string) => {
    try {
      await api.delete(`/services/${encodeURIComponent(name)}`);
      fetch();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Services</h1>
          <p className="text-slate-500">
            Manage your microservices and endpoints
          </p>
        </div>

        <div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md"
            onClick={() => setShowForm(true)}
          >
            + Add Service
          </button>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-3 gap-4">
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Name"
              className="p-2 border rounded"
            />
            <input
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="URL"
              className="p-2 border rounded"
            />
            <input
              value={form.version}
              onChange={(e) => setForm({ ...form, version: e.target.value })}
              placeholder="Version"
              className="p-2 border rounded"
            />
          </div>

          <div className="mt-4 flex gap-2">
            {editingService ? (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={update}
              >
                Update
              </button>
            ) : (
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded"
                onClick={create}
              >
                Create
              </button>
            )}

            <button
              className="px-4 py-2 rounded border"
              onClick={() => {
                setShowForm(false);
                setEditingService(null);
                setForm({ name: "", url: "", version: "1.0.0" });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <table className="w-full table-auto">
          <thead className="text-left text-slate-500">
            <tr>
              <th className="p-4">Service Name</th>
              <th className="p-4">Description / URL</th>
              <th className="p-4">Status</th>
              <th className="p-4">Last Updated</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s.name} className="border-t">
                <td className="p-4 font-medium">{s.name}</td>
                <td className="p-4 text-slate-600">{s.url}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded ${s.status === "unhealthy" ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}
                  >
                    {s.status || "Running"}
                  </span>
                </td>
                <td className="p-4">
                  {s.createdAt ? new Date(s.createdAt).toLocaleString() : "-"}
                </td>
                <td className="p-4">
                  <button
                    className="mr-2 text-slate-500 hover:text-black"
                    onClick={() => {
                      setEditingService(s);
                      setForm({
                        name: s.name,
                        url: s.url,
                        version: s.version || "1.0.0",
                      });
                      setShowForm(true);
                    }}
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => remove(s.name)}
                  >
                    <RiDeleteBin6Line />
                  </button>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-slate-400">
                  No services registered
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
