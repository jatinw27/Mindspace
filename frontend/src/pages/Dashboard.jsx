import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import CreateJournal from '../components/CreateJournal';

function Dashboard() {
  const [entries, setEntries] = useState([]);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ mood: '', content: '' });
  const [filterMood, setFilterMood] = useState('All');
  const moods = ['All', 'happy', 'sad', 'angry', 'neutral', 'anxious', 'excited', 'calm', 'stressed', 'lonely', 'grateful'];




  const fetchEntries = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/journals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEntries(res.data);
    } catch (err) {
      toast.error("Failed to fetch entries");
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const deleteEntry = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/journals/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted successfully");
      fetchEntries();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (entry) => {
    setEditId(entry._id);
    setEditForm({ mood: entry.mood, content: entry.content });
  };

  const submitEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/journals/${editId}`, editForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Updated!");
      setEditId(null);
      fetchEntries();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4 font-semibold">Your Journals</h1>
      <div className="mb-4">
  <label className="mr-2 font-medium">Filter by Mood:</label>
  <select
    value={filterMood}
    onChange={(e) => setFilterMood(e.target.value)}
    className="p-2 border rounded"
  >
    {moods.map((mood) => (
      <option key={mood} value={mood}>
        {mood.charAt(0).toUpperCase() + mood.slice(1)}
      </option>
    ))}
  </select>
</div>

      <CreateJournal onEntryAdded={fetchEntries} />
      {entries
  .filter((entry) => filterMood === 'All' || entry.mood === filterMood)
  .map((entry) => (

        <div key={entry._id} className="bg-white p-4 rounded shadow mb-4">
          {editId === entry._id ? (
            <>
              <select
  value={editForm.mood}
  onChange={(e) => setEditForm({ ...editForm, mood: e.target.value })}
  className="mb-2 p-2 w-full border rounded"
>
  {moods.slice(1).map((mood) => (
    <option key={mood} value={mood}>
      {mood.charAt(0).toUpperCase() + mood.slice(1)}
    </option>
  ))}
</select>

              <textarea
                value={editForm.content}
                onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                className="mb-2 p-2 w-full border rounded"
              />
              <button onClick={submitEdit} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">
                Save
              </button>
              <button onClick={() => setEditId(null)} className="bg-gray-500 text-white px-4 py-2 rounded">
                Cancel
              </button>
            </>
          ) : (
            <>
              <p><strong>Mood:</strong> {entry.mood}</p>
              <p><strong>Content:</strong> {entry.content}</p>
              <div className="mt-2">
                <button onClick={() => handleEdit(entry)} className="bg-yellow-500 text-white px-4 py-1 rounded mr-2">
                  Edit
                </button>
                <button onClick={() => deleteEntry(entry._id)} className="bg-red-500 text-white px-4 py-1 rounded">
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
