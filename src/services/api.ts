import axios from 'axios';
import type { Meal } from '../types/meal';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

const MOCK_MEALS: Meal[] = [
  {
    idMeal: '52772',
    strMeal: 'Teriyaki Chicken Casserole',
    strCategory: 'Chicken',
    strArea: 'Japanese',
    strInstructions:
      'Preheat oven to 350° F. Spray a 9x13-inch baking dish with cooking spray. Combine soy sauce, brown sugar, ginger, and garlic in a small saucepan. Heat and stir until sauce boils and thickens.',
    strMealThumb:
      'https://www.themealdb.com/images/media/meals/wvpsxx1468256321.jpg',
  },
  {
    idMeal: '52855',
    strMeal: 'Banana Pancakes',
    strCategory: 'Dessert',
    strArea: 'American',
    strInstructions:
      'In a bowl, mash the bananas with a fork until smooth. Whisk in eggs and vanilla extract. Heat a skillet over medium-low heat and cook until bubbles form on top.',
    strMealThumb:
      'https://www.themealdb.com/images/media/meals/sywswr1511383814.jpg',
  },
  {
    idMeal: '52944',
    strMeal: 'Escovitch Fish',
    strCategory: 'Seafood',
    strArea: 'Jamaican',
    strInstructions:
      'Rinse fish with water and lime juice. Season with salt, black pepper, and garlic powder. Fry in hot vegetable oil until crisp and brown on both sides. Top with pickled vegetables.',
    strMealThumb:
      'https://www.themealdb.com/images/media/meals/1520084413.jpg',
  },
  {
    idMeal: '52802',
    strMeal: 'Fish pie',
    strCategory: 'Seafood',
    strArea: 'British',
    strInstructions:
      '01. Preheat the oven to 180C. 02. Put the fish in a baking dish and pour over the milk. Bake for 15 minutes. 03. Mash potatoes with butter and layer over fish.',
    strMealThumb:
      'https://www.themealdb.com/images/media/meals/ysxwuq1487323065.jpg',
  },
  {
    idMeal: '52874',
    strMeal: 'Beef and Mustard Pie',
    strCategory: 'Beef',
    strArea: 'British',
    strInstructions:
      'Preheat the oven to 150C. Heat oil in a large pan and fry beef until browned. Add onions, stock, and wholegrain mustard. Top with puff pastry and bake.',
    strMealThumb:
      'https://www.themealdb.com/images/media/meals/sytuqu1511553755.jpg',
  },
];

let cachedMeals: Meal[] | null = null;

export const fetchAllMeals = async (): Promise<Meal[]> => {
  if (cachedMeals && cachedMeals.length > 0) {
    return cachedMeals;
  }

  try {
    const letters = ['b', 'c', 's', 'm', 'p'];
    const requests = letters.map((char) =>
      axios.get<{ meals: Meal[] | null }>(`${BASE_URL}/search.php?f=${char}`, {
        timeout: 5000, 
      })
    );

    const responses = await Promise.all(requests);
    const mealsMap = new Map<string, Meal>();

    responses.forEach((res) => {
      if (res.data && res.data.meals) {
        res.data.meals.forEach((meal) => mealsMap.set(meal.idMeal, meal));
      }
    });

    const results = Array.from(mealsMap.values());
    if (results.length > 0) {
      cachedMeals = results;
      return results;
    }

    console.warn('API returned no results. Utilizing fallback mock dataset.');
    cachedMeals = MOCK_MEALS;
    return MOCK_MEALS;
  } catch (error) {
    console.error('API request failed. Falling back to local mock data:', error);
    cachedMeals = MOCK_MEALS;
    return MOCK_MEALS;
  }
};