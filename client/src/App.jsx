import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import ArchivedView from './pages/ArchivedView';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="submit" element={<SubmitResource />} />
        <Route path="teams/:teamId" element={<TeamView />} />
        <Route path="archived" element={<ArchivedView />} />
      </Route>
    </Routes>
  );
}

export default App;
