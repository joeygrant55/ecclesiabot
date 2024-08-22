import React, { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';

const JournalEntry: React.FC = () => {
  const [entry, setEntry] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'journal_entries'), {
        content: entry,
        timestamp: new Date(),
      });
      setEntry('');
      alert('Journal entry saved!');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div>
      <h2>Journal Entry</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          placeholder="Write your thoughts here..."
          rows={10}
          cols={50}
        />
        <br />
        <button type="submit">Save Entry</button>
      </form>
    </div>
  );
};

export default JournalEntry;