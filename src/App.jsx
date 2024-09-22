import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./contexts/AuthContext";
import Layout from './layouts/Layout';
import VideosPage from "./pages/VideosPage";
import TodoPage from './pages/TodoPage';
import ExercisesPage from "./pages/ExercisePage";
import StartExercises from './components/Exercises/StartExercise';
import SitePage from './pages/SitePage';



const App = () => {
  return (
    <Router>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="videos" element={<VideosPage />} />
          <Route path="todos" element={<TodoPage />} />
          <Route path="exercises" element={<ExercisesPage />} />
          <Route path="/start-exercise" element={<StartExercises />} />
          <Route path="sites" element={<SitePage />} />
          </Route>
      </Routes>
    </AuthProvider>
  </Router>
  );
};

export default App;
