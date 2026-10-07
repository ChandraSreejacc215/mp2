import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Meal } from '../types/meal';
import styles from './DetailView.module.css';


interface DetailViewProps {
  meals: Meal[];
}



export const DetailView: React.FC<DetailViewProps> = ({ meals }) => {
  const { id } = useParams<{ id: string }>();

  const currentIndex = useMemo(() => {
    return meals.findIndex((m) => m.idMeal === id);
  }, [meals, id]);

  const meal = meals[currentIndex];
  const ingredients = useMemo(() => {
    if (!meal) return [];
    const list: { name: string; measure: string; imgUrl: string }[] = [];

    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];

      if (ingredient && ingredient.trim() !== '') {
        const cleanName = ingredient.trim();
        list.push({
          name: cleanName,
          measure: measure && measure.trim() !== '' ? measure.trim() : 'To taste',
          imgUrl: `https://www.themealdb.com/images/ingredients/${encodeURIComponent(cleanName)}-Small.png`,
        });
      }
    }
    return list;
  }, [meal]);


  const instructionSteps = useMemo(() => {
    if (!meal?.strInstructions) return [];
    return meal.strInstructions
      .split(/\r?\n+/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && !line.match(/^(step \d+|instructions:?)$/i));
  }, [meal]);

  if (!meal) {
    return (
      <div className={styles.container}>
        <p>Meal details not found or loading...</p>
        <Link to="/" className={styles.navButton}>
          Back to List
        </Link>
      </div>
    );
  }

  const prevId = currentIndex > 0 ? meals[currentIndex - 1].idMeal : null;
  const nextId =
    currentIndex < meals.length - 1 ? meals[currentIndex + 1].idMeal : null;

  return (
    <div className={styles.container}>
  {/* Return link sitting naturally at the top left */}
  <div className={styles.backRow}>
    <Link to="/" className={styles.backLink}>
      ‹ Back to Home
    </Link>
  </div>

  <nav className={styles.navControls}>
    <Link
      to={prevId ? `/details/${prevId}` : '#'}
      className={`${styles.navButton} ${!prevId ? styles.disabledLink : ''}`}
    >
      ← Previous
    </Link>

    <span className={styles.counterBadge}>
      Recipe {currentIndex + 1} of {meals.length}
    </span>

    <Link
      to={nextId ? `/details/${nextId}` : '#'}
      className={`${styles.navButton} ${!nextId ? styles.disabledLink : ''}`}
    >
      Next →
    </Link>
  </nav>


      <article className={styles.card}>
        <img
          src={meal.strMealThumb}
          alt={meal.strMeal}
          className={styles.heroImage}
        />

        <div className={styles.content}>
          <h1 className={styles.headerTitle}>{meal.strMeal}</h1>


          <div className={styles.badges}>
            <span className={`${styles.badge} ${styles.badgeHighlight}`}>
              ID: {meal.idMeal}
            </span>
            <span className={styles.badge}>
              Category: {meal.strCategory || 'General'}
            </span>
            <span className={styles.badge}>
              Cuisine: {meal.strArea?.trim() ? meal.strArea : 'International'}
            </span>
            {meal.strTags && (
              <span className={styles.badge}>Tags: {meal.strTags}</span>
            )}
          </div>

   
          {ingredients.length > 0 && (
            <section>
              <h2 className={styles.sectionTitle}>
                Ingredients ({ingredients.length})
              </h2>
              <div className={styles.ingredientsGrid}>
                {ingredients.map((item, index) => (
                  <div key={index} className={styles.ingredientItem}>
                    <img
                      src={item.imgUrl}
                      alt={item.name}
                      className={styles.ingredientThumb}
                      loading="lazy"
                    />
                    <div className={styles.ingredientText}>
                      <span className={styles.ingredientName}>{item.name}</span>
                      <span className={styles.ingredientMeasure}>{item.measure}</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}




          <section>
            <h2 className={styles.sectionTitle}>Preparation Steps</h2>
            <div className={styles.stepsContainer}>
              {instructionSteps.length > 0 ? (
                instructionSteps.map((step, idx) => (
                  <div key={idx} className={styles.stepRow}>
                    <span className={styles.stepNumber}>{idx + 1}</span>
                    <p className={styles.stepText}>{step}</p>
                  </div>
                ))
              ) : (
                <p className={styles.stepText}>{meal.strInstructions}</p>
              )}
            </div>
          </section>

          
          {(meal.strYoutube || meal.strSource) && (
            <div className={styles.linkSection}>
              {meal.strYoutube && (
                <a
                  href={meal.strYoutube}
                  target="_blank"
                  rel="noreferrer"
                  className={`${styles.actionButton} ${styles.youtubeButton}`}
                >
                  Watch Tutorial Video ↗
                </a>
              )}
              {meal.strSource && (
                <a
                  href={meal.strSource}
                  target="_blank"
                  rel="noreferrer"
                  className={`${styles.actionButton} ${styles.sourceButton}`}
                >
                  Original Source ↗
                </a>
              )}

            </div>
          )}
        </div>
      </article>
    </div>
  );
};