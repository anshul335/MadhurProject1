const HeaderControls = ({ userId, searchTerm, setSearchTerm, showForm, setShowForm }) => {
  return (
    <header className="max-w-4xl mx-auto mb-8">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-2">
        SnippetVault
      </h1>
      <p className="text-gray-400 mb-6">Centralized, collaborative code management for developers. Your User ID: <span className="text-sm font-mono text-cyan-400">{userId}</span></p>

      {/* Search and Add Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by title, code, tag, or language..."
            className="w-full p-3 pl-10 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition duration-200 shadow-md flex items-center justify-center sm:w-auto"
        >
          <Plus size={20} className="mr-1" /> {showForm ? 'Hide Form' : 'New Snippet'}
        </button>
      </div>
    </header>
  );
};