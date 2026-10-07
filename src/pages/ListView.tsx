import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import type { Meal, SortProperty, SortOrder } from '../types/meal';
import styles from './ListView.module.css';

interface ListViewProps {
  meals: Meal[];
  loading: boolean;
}

export const ListView: React.FC<ListViewProps> = ({ meals, loading }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortProperty, setSortProperty] = useState<SortProperty>('strMeal');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');


  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    meals.forEach((m) => {
      if (m.strCategory?.trim()) set.add(m.strCategory.trim());
    });
    return Array.from(set).sort();
  }, [meals]);

  

  const filteredAndSortedMeals = useMemo(() => {
    return meals
      .filter((meal) => {
        const matchesQuery = meal.strMeal
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const matchesCat =
          selectedCategory === 'All' || meal.strCategory === selectedCategory;
        return matchesQuery && matchesCat;
      })
      .sort((a, b) => {
        const valA = a[sortProperty];
        const valB = b[sortProperty];

        let comparison = 0;
        if (sortProperty === 'idMeal') {
          comparison = Number(valA) - Number(valB);
        } else {
          comparison = valA.localeCompare(valB);
        }

        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [meals, searchQuery, selectedCategory, sortProperty, sortOrder]);

  const resetAll = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSortProperty('strMeal');
    setSortOrder('asc');
  };

  if (loading) return <div className={styles.container}>Loading recipes...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.controlHub}>
        {/* Search Input with Clear Button */}
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search for a recipe"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className={styles.clearSearchBtn}
              onClick={() => setSearchQuery('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

   
        <div className={styles.filterRow}>
          <div className={styles.selectGroupWrapper}>
            {/* Category Filter */}
            <div className={styles.filterBox}>
              <label htmlFor="categoryFilter" className={styles.filterLabel}>
                Category
              </label>
              <select
                id="categoryFilter"
                className={styles.selectInput}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {categoryOptions.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>


            <div className={styles.filterBox}>
              <label htmlFor="sortProp" className={styles.filterLabel}>
                Sort By
              </label>
              <select
                id="sortProp"
                className={styles.selectInput}
                value={sortProperty}
                onChange={(e) => setSortProperty(e.target.value as SortProperty)}
              >
                <option value="strMeal">Recipe Name</option>
                <option value="idMeal">Meal ID</option>
              </select>
            </div>
          </div>
          <div className={styles.segmentedControl}>
            <button
              type="button"
              className={`${styles.segmentBtn} ${
                sortOrder === 'asc' ? styles.activeSegment : ''
              }`}
              onClick={() => setSortOrder('asc')}
            >
              <span>Ascending</span> ↑
            </button>
            <button
              type="button"
              className={`${styles.segmentBtn} ${
                sortOrder === 'desc' ? styles.activeSegment : ''
              }`}
              onClick={() => setSortOrder('desc')}
            >
              <span>Descending</span> ↓
            </button>
          </div>
        </div>
      </div>

    
      <div className={styles.statsBar}>
        <span>
          Showing <strong>{filteredAndSortedMeals.length}</strong> of {meals.length} recipes
        </span>


        {(searchQuery || selectedCategory !== 'All') && (
          <button className={styles.resetTextBtn} onClick={resetAll}>
            Reset filters
          </button>
        )}
      </div>


      {filteredAndSortedMeals.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No recipes match your filter criteria.</p>
          <button className={styles.resetBtn} onClick={resetAll}>
            Clear All Filters
          </button>
        </div>
      ) : (
        <section className={styles.list}>
          {filteredAndSortedMeals.map((meal) => (
            <Link
              key={meal.idMeal}
              to={`/details/${meal.idMeal}`}
              className={styles.listItem}
            >
              <img
                src={meal.strMealThumb}
                alt={meal.strMeal}
                className={styles.thumbnail}
                loading="lazy"
              />
              <div className={styles.itemInfo}>
                <h3 className={styles.itemTitle}>{meal.strMeal}</h3>
                <div className={styles.metaRow}>
                  <span className={styles.idBadge}>#{meal.idMeal}</span>
                  <span className={styles.categoryBadge}>
                    {meal.strCategory || 'General'}
                  </span>
                  <span className={styles.cuisineBadge}>
                    Cuisine: {meal.strArea?.trim() ? meal.strArea : 'International'}
                  </span>
                </div>
              </div>
              <span className={styles.chevron}>›</span>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
};