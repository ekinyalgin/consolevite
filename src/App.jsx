import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./contexts/AuthContext";
import Layout from './layouts/Layout';
import VideosPage from "./pages/VideosPage";

const App = () => {
  return (
    <Router>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="videos" element={<VideosPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  </Router>
  );
};

export default App;
