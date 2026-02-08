import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import SubmitResource from './pages/SubmitResource';
import TeamView from './pages/TeamView';
import MyCollection from './pages/MyCollection';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="submit" element={<SubmitResource />} />
        <Route path="teams/:teamId" element={<TeamView />} />
        <Route path="collection" element={<MyCollection />} />
      </Route>
    </Routes>
  );
}

export default App;
