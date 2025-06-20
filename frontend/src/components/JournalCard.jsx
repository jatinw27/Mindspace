import React from 'react'

function JournalCard({ entry, onEdit, onDelete }) {
  return (
    <div className="bg-white shadow-md p-4 rounded-md mb-4">
    <h3 className="text-lg font-bold">{entry.mood}</h3>
    <p className="text-sm mt-1">{entry.content}</p>
    <div className="flex justify-end gap-2 mt-3">
      <button onClick={() => onEdit(entry)} className="text-blue-600">Edit</button>
      <button onClick={() => onDelete(entry._id)} className="text-red-600">Delete</button>
    </div>
  </div> 
   )
}

export default JournalCard