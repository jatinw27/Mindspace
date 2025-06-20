import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast';

const moods = ['happy', 'sad', 'angry', 'neutral', 'anxious', 'excited', 'calm', 'stressed', 'lonely', 'grateful'];

function CreateJournal({ onEntryAdded }) {
  const [formData, setFormData] = useState({
    mood: '',
    content: '',
    public: false,
  });


  const handleSubmit = async (e) => {
    e.preventDefault();
    const { mood, content } = formData;

    if (!mood || !content.trim()) {
      return toast.error("Please select a mood and write something.");
    }

    try {
      const token = localStorage.getItem('token');
      console.log("Submitting journal:", formData);

      await axios.post('http://localhost:5000/api/journals', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Entry added!");
      setFormData({ mood: '', content: '' });
      onEntryAdded();
    } catch (err) {
      console.error("Journal creation error:", err.response?.data || err.message);
      toast.error("Failed to add journal entry");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md w-full mb-4">
      <label className="block mb-1 font-medium">Mood</label>
      <select
        value={formData.mood}
        onChange={(e) => setFormData({ ...formData, mood: e.target.value })}
        className="w-full mb-3 p-2 border rounded"
      >
        <option value="">Select mood</option>
        {moods.map((mood) => (
          <option key={mood} value={mood}>
            {mood.charAt(0).toUpperCase() + mood.slice(1)}
          </option>
        ))}
      </select>

      <label className="block mb-1 font-medium">What's on your mind?</label>
      <textarea
        placeholder="Write your thoughts here..."
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        className="w-full mb-3 p-2 border rounded"
        rows={4}
      />
      <label className="inline-flex items-center mb-3">
  <input
    type="checkbox"
    checked={formData.public}
    onChange={(e) => setFormData({ ...formData, public: e.target.checked })}
    className="mr-2"
  />
  Make this journal public
</label>


      <button className="bg-green-500 text-white px-4 py-2 rounded w-full">
        Add Entry
      </button>
    </form>
  );
}

export default CreateJournal;
