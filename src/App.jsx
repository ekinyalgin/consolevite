import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./contexts/AuthContext";
import Layout from './layouts/Layout';
import VideoPage from "./pages/VideoPage";
import TodoPage from './pages/TodoPage';
import ExercisePage from "./pages/ExercisePage";
import StartExercises from './components/Exercises/StartExercise';
import SitePage from './pages/SitePage';
import UrlReview from './components/Sites/UrlReview';

const App = () => {
  return (
    <Router> 
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="videos" element={<VideoPage />} />
          <Route path="todos" element={<TodoPage />} />
          <Route path="exercises" element={<ExercisePage />} />
          <Route path="/start-exercise" element={<StartExercises />} />
          <Route path="sites" element={<SitePage />} />
          <Route path="/url-review/:domainName" element={<UrlReview />} />
          </Route>
      </Routes>
    </AuthProvider>
  </Router>
  );
};

export default App;
