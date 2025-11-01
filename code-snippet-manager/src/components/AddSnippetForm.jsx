const AddSnippetForm = ({ db, userId, onSnippetAdded }) => {
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!db || !userId || !title || !code) return;

    setIsLoading(true);
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);

    try {
      const collectionPath = `/artifacts/${appId}/public/data/snippets`;
      await addDoc(collection(db, collectionPath), {
        title,
        code,
        language,
        tags: tagArray,
        description,
        authorId: userId,
        createdAt: serverTimestamp(),
      });
      // Reset form on success
      setTitle('');
      setCode('');
      setTags('');
      setDescription('');
      onSnippetAdded();
    } catch (e) {
      console.error("Error adding document: ", e);
      // Using a custom alert replacement for the component
      alert('Error saving snippet. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = "w-full p-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1";
  
  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl shadow-2xl space-y-4">
      <h2 className="text-2xl font-extrabold text-white flex items-center border-b border-indigo-500 pb-2 mb-4">
        <Plus className="mr-2" size={24} /> Add New Snippet
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>Title</label>
          <input
            type="text"
            className={inputClass}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g., React Fetch Hook"
          />
        </div>

        <div>
          <label className={labelClass}>Language</label>
          <select
            className={inputClass}
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            {Object.keys(LANGUAGES).map(key => (
              <option key={key} value={key}>{LANGUAGES[key].name}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Code Snippet</label>
        <textarea
          className={`${inputClass} font-mono h-40`}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          required
          placeholder="Paste your code here..."
        ></textarea>
      </div>

      <div>
        <label className={labelClass}>Description</label>
        <textarea
          className={`${inputClass} h-16`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief explanation of the snippet's purpose."
        ></textarea>
      </div>

      <div>
        <label className={labelClass}>Tags (comma-separated)</label>
        <input
          type="text"
          className={inputClass}
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="e.g., react, hook, data-fetching"
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition duration-200 shadow-lg disabled:bg-gray-500 flex items-center justify-center"
        disabled={isLoading || !db}
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <><Plus size={20} className="mr-2" /> Save Snippet</>
        )}
      </button>
    </form>
  );
};