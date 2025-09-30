import React, { useState } from 'react';
import { IndexSelector } from './components/IndexSelector';
import { DocumentViewer } from './components/DocumentViewer';
import './App.css';

function App() {
  const [selectedIndex, setSelectedIndex] = useState('');

  return (
    <div className="app">
      <header className="app-header">
        <h1>Elasticsearch Document Viewer</h1>
      </header>
      
      <main className="app-main">
        <IndexSelector onIndexSelect={setSelectedIndex} />
        <DocumentViewer indexName={selectedIndex} />
      </main>
    </div>
  );
}

export default App;
