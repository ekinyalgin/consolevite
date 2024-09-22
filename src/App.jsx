import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from "./contexts/AuthContext";
import Layout from './layouts/Layout';
import VideosPage from "./pages/VideosPage";
import ExercisesPage from "./pages/ExercisePage";
import StartExercises from './components/Exercises/StartExercise';


const App = () => {
  return (
    <Router>
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="videos" element={<VideosPage />} />
          <Route path="exercises" element={<ExercisesPage />} />
          <Route path="/start-exercise" element={<StartExercises />} />
          </Route>
      </Routes>
    </AuthProvider>
  </Router>
  );
};

export default App;
