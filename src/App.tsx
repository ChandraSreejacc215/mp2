import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ListView } from './pages/ListView';
import { GalleryView } from './pages/GalleryView';
import { DetailView } from './pages/DetailView';
import type { Meal } from './types/meal';
import { fetchAllMeals } from './services/api';
import { ScrollToTop } from './components/ScrollToTop'; //

export const App: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchAllMeals()
      .then((data) => {
        setMeals(data);
      })
      .catch((err) => {
        console.error('Error in App loading meals:', err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <ScrollToTop />
      <Navbar />
     
      <Routes>
        <Route path="/" element={<ListView meals={meals} loading={loading} />} />
        <Route
          path="/gallery"
          element={<GalleryView meals={meals} loading={loading} />}
        />
        <Route path="/details/:id" element={<DetailView meals={meals} />} />
      </Routes>
    </div>
  );
};