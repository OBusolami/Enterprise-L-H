import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import SubmitResource from './pages/SubmitResource';
import TeamView from './pages/TeamView';
import MyCollection from './pages/MyCollection';
import Login from './pages/Login';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="submit" element={<SubmitResource />} />
          <Route path="teams/:teamId" element={<TeamView />} />
          <Route path="collection" element={<MyCollection />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
