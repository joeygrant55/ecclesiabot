import React, { useState, useEffect } from 'react';
import { signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import JournalEntry from "./components/JournalEntry";
import { SearchVerses } from './components/SearchVerses';

function App() {
  const [activeTab, setActiveTab] = useState('scripture');
  const [notes, setNotes] = useState('');
  const [prayer, setPrayer] = useState('');
  const [verseIndex, setVerseIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [user, setUser] = useState(null);

  const verses = [
    { text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.", reference: "John 3:16" },
    { text: "I can do all this through him who gives me strength.", reference: "Philippians 4:13" },
    { text: "Trust in the LORD with all your heart and lean not on your own understanding;", reference: "Proverbs 3:5" },
    { text: "The LORD is my shepherd, I lack nothing.", reference: "Psalm 23:1" },
    { text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.", reference: "1 Corinthians 13:4" },
    { text: "But seek first his kingdom and his righteousness, and all these things will be given to you as well.", reference: "Matthew 6:33" },
    { text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.", reference: "Joshua 1:9" },
    { text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.", reference: "Romans 8:28" },
    { text: "The LORD is my light and my salvation—whom shall I fear? The LORD is the stronghold of my life—of whom shall I be afraid?", reference: "Psalm 27:1" },
  ];

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    const savedPrayer = localStorage.getItem('prayer');
    if (savedNotes) setNotes(savedNotes);
    if (savedPrayer) setPrayer(savedPrayer);
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const results = verses.filter(verse => 
        verse.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        verse.reference.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const saveNotes = () => {
    localStorage.setItem('notes', notes);
    alert('Notes saved!');
  };

  const savePrayer = () => {
    localStorage.setItem('prayer', prayer);
    alert('Prayer saved!');
  };

  const getNextVerse = () => {
    setVerseIndex((prevIndex) => (prevIndex + 1) % verses.length);
  };

  const toggleBookmark = (verse) => {
    setBookmarks(prevBookmarks => {
      if (prevBookmarks.some(v => v.reference === verse.reference)) {
        return prevBookmarks.filter(v => v.reference !== verse.reference);
      } else {
        return [...prevBookmarks, verse];
      }
    });
  };

  const handleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const renderAuthButton = () => {
    if (user) {
      return (
        <div>
          <p>Welcome, {user.displayName}!</p>
          <button onClick={handleSignOut} style={buttonStyle}>Sign Out</button>
        </div>
      );
    } else {
      return <button onClick={handleSignIn} style={buttonStyle}>Sign In with Google</button>;
    }
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'scripture':
        return (
          <div>
            <h2>Verse of the Day</h2>
            <p style={{ fontStyle: 'italic', marginBottom: '10px' }}>{verses[verseIndex].text}</p>
            <p style={{ fontWeight: 'bold' }}>{verses[verseIndex].reference}</p>
            <button onClick={() => toggleBookmark(verses[verseIndex])} style={buttonStyle}>
              {bookmarks.some(v => v.reference === verses[verseIndex].reference) ? 'Unbookmark' : 'Bookmark'}
            </button>
            <button onClick={getNextVerse} style={buttonStyle}>Get Next Verse</button>

            <h3 style={{ marginTop: '20px' }}>Search Verses</h3>
            <SearchVerses />
          </div>
        );
      case 'study':
        return (
          <div>
            <h2>Study Aids</h2>
            <p>Here you would find commentaries and cross-references.</p>
          </div>
        );
      case 'notes':
        return (
          <div>
            <h2>Personal Reflections</h2>
            <textarea 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Record your thoughts here..."
              style={textareaStyle}
            />
            <button onClick={saveNotes} style={buttonStyle}>Save Notes</button>
          </div>
        );
      case 'prayer':
        return (
          <div>
            <h2>Prayer Journal</h2>
            <textarea 
              value={prayer} 
              onChange={(e) => setPrayer(e.target.value)}
              placeholder="Write your prayers here..."
              style={textareaStyle}
            />
            <button onClick={savePrayer} style={buttonStyle}>Save Prayer</button>
          </div>
        );
      case 'bookmarks':
        return (
          <div>
            <h2>Bookmarked Verses</h2>
            {bookmarks.map((verse, index) => (
              <div key={index}>
                <p style={{ fontStyle: 'italic' }}>{verse.text}</p>
                <p style={{ fontWeight: 'bold' }}>{verse.reference}</p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={appStyle}>
      <h1 style={headerStyle}>Ecclesia Companion</h1>
      {renderAuthButton()}
      <div style={tabContainerStyle}>
        {['Scripture', 'Study', 'Notes', 'Prayer', 'Bookmarks'].map((tab) => (
          <button 
            key={tab.toLowerCase()} 
            onClick={() => setActiveTab(tab.toLowerCase())}
            style={{
              ...tabStyle,
              background: activeTab === tab.toLowerCase() ? '#4A0E4E' : '#F3E5AB',
              color: activeTab === tab.toLowerCase() ? '#F3E5AB' : '#4A0E4E',
            }}
          >
            {tab}
          </button>
        ))}
      </div>
      <div style={contentStyle}>
        {renderContent()}
        <SearchVerses />
        <JournalEntry />
      </div>
    </div>
  );
}

const appStyle = {
  fontFamily: 'Georgia, serif',
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px',
  background: '#FFF8E7',
  minHeight: '100vh',
  boxShadow: '0 0 10px rgba(0,0,0,0.1)'
};

const headerStyle = {
  textAlign: 'center',
  color: '#4A0E4E',
  fontSize: '2.5em',
  marginBottom: '30px'
};

const tabContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  marginBottom: '20px'
};

const tabStyle = {
  margin: '0 5px',
  padding: '10px 15px',
  border: 'none',
  cursor: 'pointer',
  borderRadius: '5px',
  fontWeight: 'bold',
  transition: 'all 0.3s ease'
};

const contentStyle = {
  background: 'white',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 0 5px rgba(0,0,0,0.1)'
};

const textareaStyle = {
  width: '100%',
  height: '150px',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '5px',
  border: '1px solid #4A0E4E'
};

const buttonStyle = {
  padding: '10px 20px',
  background: '#4A0E4E',
  color: '#F3E5AB',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: 'bold',
  transition: 'all 0.3s ease'
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '5px',
  border: '1px solid #4A0E4E'
};

export default App;