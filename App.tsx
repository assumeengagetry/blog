import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import PostView from './pages/PostView';
import Editor from './pages/Editor';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostView />} />
          <Route path="/editor/:id" element={<Editor />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;