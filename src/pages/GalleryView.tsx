import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Meal } from '../types/meal';
import styles from './GalleryView.module.css';

interface GalleryViewProps {
  meals: Meal[];
  loading: boolean;
}

export const GalleryView: React.FC<GalleryViewProps> = ({ meals, loading }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    meals.forEach((m) => m.strCategory && set.add(m.strCategory));
    return Array.from(set).sort();
  }, [meals]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => setSelectedCategories([]);

  const filteredMeals = useMemo(() => {
    if (selectedCategories.length === 0) return meals;
    return meals.filter((meal) => selectedCategories.includes(meal.strCategory));
  }, [meals, selectedCategories]);

  if (loading) return <div className={styles.container}>Loading gallery...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.filterSection}>
        <h3>Filter by Category:</h3>
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterChip} ${
              selectedCategories.length === 0 ? styles.activeChip : ''
            }`}
            onClick={clearFilters}
          >
            All
          </button>
          {categories.map((category) => (
            <button
              key={category}
              className={`${styles.filterChip} ${
                selectedCategories.includes(category) ? styles.activeChip : ''
              }`}
              onClick={() => toggleCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.grid}>
        {filteredMeals.map((meal) => (
          <Link
            key={meal.idMeal}
            to={`/details/${meal.idMeal}`}
            className={styles.card}
          >
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className={styles.image}
              loading="lazy"
            />
            <div className={styles.cardBody}>
              <h4>{meal.strMeal}</h4>
              <span className={styles.badge}>{meal.strCategory}</span>
              
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};