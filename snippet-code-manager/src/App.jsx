import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCustomToken, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, query, addDoc, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore';
import { Copy, Plus, Search, Code, Tag, User } from 'lucide-react';

// --- Configuration Constants (Would be in constants/languages.js) ---
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {};
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

const LANGUAGES = {
  'javascript': { color: 'text-yellow-400', name: 'JavaScript' },
  'python': { color: 'text-blue-400', name: 'Python' },
  'html': { color: 'text-red-400', name: 'HTML' },
  'css': { color: 'text-cyan-400', name: 'CSS' },
  'markdown': { color: 'text-gray-400', name: 'Markdown' },
  'generic': { color: 'text-indigo-400', name: 'Generic' }
};

const App = () => {
  const { db, userId, isReady } = useFirebase();
  const [snippets, setSnippets] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Firestore Real-time Listener (Data Fetching)
  useEffect(() => {
    if (!db || !userId) return;

    const collectionPath = `/artifacts/${appId}/public/data/snippets`;
    const snippetsCollection = collection(db, collectionPath);
    
    // Order by creation date descending
    const q = query(snippetsCollection, orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedSnippets = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        authorId: doc.data().authorId || 'unknown'
      }));
      setSnippets(fetchedSnippets);
    }, (error) => {
      console.error("Error fetching real-time snippets:", error);
    });

    return () => unsubscribe();
  }, [db, userId]);

  // Filtered Snippets (Advanced Search Logic)
  const filteredSnippets = useMemo(() => {
    if (!searchTerm) {
      return snippets;
    }
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    
    return snippets.filter(snippet => 
      snippet.title.toLowerCase().includes(lowerCaseSearchTerm) ||
      snippet.code.toLowerCase().includes(lowerCaseSearchTerm) ||
      snippet.description.toLowerCase().includes(lowerCaseSearchTerm) ||
      snippet.language.toLowerCase().includes(lowerCaseSearchTerm) ||
      (Array.isArray(snippet.tags) && snippet.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm)))
    );
  }, [snippets, searchTerm]);

  // Callback to handle successful addition
  const handleSnippetAdded = useCallback(() => {
    setShowForm(false);
  }, []);

  if (!isReady) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <div className="text-xl">Loading Firebase and Authentication...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white font-inter p-4 sm:p-8">
      
      {/* 1. Header and Controls */}
      <HeaderControls 
        userId={userId} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        showForm={showForm} 
        setShowForm={setShowForm} 
      />

      <main className="max-w-4xl mx-auto">
        {/* 2. Add Snippet Form */}
        {showForm && (
          <div className="mb-8">
            <AddSnippetForm db={db} userId={userId} onSnippetAdded={handleSnippetAdded} />
          </div>
        )}

        {/* 3. Snippet List */}
        <h2 className="text-3xl font-bold text-white mb-6">
          {searchTerm ? `Found ${filteredSnippets.length} Snippets` : 'All Snippets'}
        </h2>
        
        {snippets.length === 0 && !searchTerm ? (
          <div className="text-gray-500 text-lg p-10 bg-gray-800 rounded-xl text-center">
            No snippets found. Click "New Snippet" to start your vault!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredSnippets.map(snippet => (
              <SnippetCard key={snippet.id} snippet={snippet} />
            ))}
          </div>
        )}
        
        {filteredSnippets.length === 0 && searchTerm && (
          <div className="text-gray-500 text-lg p-10 bg-gray-800 rounded-xl text-center">
            No results match "{searchTerm}". Try broadening your search.
          </div>
        )}

      </main>
    </div>
  );
};

export default App;