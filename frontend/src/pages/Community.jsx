import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

function Community() {
  const [publicEntries, setPublicEntries] = useState([]);

  const fetchPublicEntries = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/journals/public/all');
      setPublicEntries(res.data);
    } catch (error) {
      toast.error('Failed to load public entries');
    }
  };

  useEffect(() => {
    fetchPublicEntries();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">🌍 Community Journals</h2>
      {publicEntries.length === 0 ? (
        <p className="text-gray-600">No public journal entries yet.</p>
      ) : (
        publicEntries.map((entry) => (
          <div key={entry._id} className="bg-white p-4 rounded shadow mb-4">
            <p><strong>🧠 Mood:</strong> {entry.mood}</p>
            <p><strong>📝 Thought:</strong> {entry.content}</p>
            <p className="text-sm text-gray-500 mt-2">✍️ Shared by: {entry.user?.username || 'Anonymous'}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Community;
