import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from "./contexts/AuthContext";
import Layout from './layouts/Layout';
import ProductionLayout from './layouts/ProductionLayout';
import VideoPage from "./components//Videos/VideoContainer";
import TodoPage from './components/Todos/TodoContainer';
import ExercisePage from "./components/Exercises/ExerciseContainer";
import StartExercise from './components/Exercises/StartExercise';
import SitePage from './components/Sites/SiteContainer';
import UrlReview from './components/Sites/UrlReview';
import ProductionComponent from './components/Production/ProductionComponent';
import MonthlyBalance from './components/Finance/MonthlyBalance'; 
import ProductPurchasePlanner from './components/Finance/ProductPurchasePlanner';
import ProductList from './components/Finance/ProductList'; 

const App = () => {
  return (
    <Router> 
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="inspire" element={<VideoPage />} />
          <Route path="todos" element={<TodoPage />} />
          <Route path="exercises" element={<ExercisePage />} />
          <Route path="/start-exercise" element={<StartExercise />} />
          <Route path="sites" element={<SitePage />} />
          <Route path="/url-review/:domainName" element={<UrlReview />} />
          <Route path="finance" element={<MonthlyBalance />} />
          <Route path="purchase-planner" element={<ProductPurchasePlanner />} />
          <Route path="product-list" element={<ProductList />} />
        </Route>
        <Route path="/production" element={<ProductionLayout />}>
          <Route index element={<ProductionComponent />} />
        </Route>
      </Routes>
    </AuthProvider>
  </Router>
  );
};

export default App;
