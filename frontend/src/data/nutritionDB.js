const nutritionDB = {
  banana: {
    label: "Banana Nutrition",
    items: ["Potassium: 358mg", "Fiber: 3.1g", "Calories: 89", "Vitamin B6: 0.4mg", "Vitamin C: 8.7mg"],
    protein: "1.1g",
    energy: "89 kcal"
  },
  nendran: {
    label: "Nendran Banana Nutrition",
    items: ["Potassium: 450mg", "Fiber: 3.5g", "Calories: 120", "Vitamin A: 64 IU", "Iron: 0.6mg"],
    protein: "1.3g",
    energy: "120 kcal"
  },
  coconut: {
    label: "Coconut Nutrition",
    items: ["Fiber: 9g", "Manganese: 1.5mg", "Calories: 354", "Iron: 2.4mg", "Selenium: 10.1µg"],
    protein: "3.3g",
    energy: "354 kcal"
  },
  egg: {
    label: "Egg Nutrition",
    items: ["Protein: 6.3g", "Calcium: 50mg", "Calories: 72", "Vitamin D: 41 IU", "Iron: 0.9mg"],
    protein: "6.3g",
    energy: "72 kcal"
  },
  duck: {
    label: "Duck Egg Nutrition",
    items: ["Protein: 8.1g", "Calcium: 64mg", "Calories: 105", "Iron: 2.7mg", "Vitamin B12: 5.1µg"],
    protein: "8.1g",
    energy: "105 kcal"
  },
  milk: {
    label: "Milk Nutrition",
    items: ["Calcium: 300mg", "Protein: 8g", "Calories: 149", "Vitamin D: 124 IU", "Vitamin B12: 1.1µg"],
    protein: "8g",
    energy: "149 kcal"
  },
  tapioca: {
    label: "Tapioca Nutrition",
    items: ["Carbs: 38g", "Fiber: 1.8g", "Calories: 160", "Vitamin C: 21mg", "Manganese: 0.4mg"],
    protein: "1.4g",
    energy: "160 kcal"
  },
  kappa: {
    label: "Tapioca (Kappa) Nutrition",
    items: ["Carbs: 38g", "Fiber: 1.8g", "Calories: 160", "Vitamin C: 21mg", "Manganese: 0.4mg"],
    protein: "1.4g",
    energy: "160 kcal"
  },
  tomato: {
    label: "Tomato Nutrition",
    items: ["Vitamin C: 14mg", "Potassium: 237mg", "Calories: 18", "Vitamin A: 833 IU", "Lycopene: 2573µg"],
    protein: "0.9g",
    energy: "18 kcal"
  },
  rice: {
    label: "Rice Nutrition",
    items: ["Carbs: 45g", "Fiber: 0.6g", "Calories: 206", "Iron: 1.2mg", "Vitamin B1: 0.2mg"],
    protein: "4.3g",
    energy: "206 kcal"
  },
  matta: {
    label: "Red Matta Rice Nutrition",
    items: ["Fiber: 2.8g", "Iron: 3.5mg", "Calories: 215", "Magnesium: 85mg", "Zinc: 1.5mg"],
    protein: "5.2g",
    energy: "215 kcal"
  },
  honey: {
    label: "Forest Honey Nutrition",
    items: ["Calories: 304", "Antioxidants: High", "Vitamin C: 0.5mg", "Calcium: 6mg", "Iron: 0.4mg"],
    protein: "0.3g",
    energy: "304 kcal"
  },
  greens: {
    label: "Leafy Greens Nutrition",
    items: ["Iron: 2.7mg", "Calcium: 100mg", "Calories: 23", "Vitamin K: 482µg", "Vitamin C: 28mg"],
    protein: "2.9g",
    energy: "23 kcal"
  },
  spinach: {
    label: "Spinach Nutrition",
    items: ["Iron: 3.6mg", "Calcium: 100mg", "Calories: 23", "Vitamin A: 2813 IU", "Vitamin K: 483µg"],
    protein: "2.9g",
    energy: "23 kcal"
  },
  mango: {
    label: "Mango Nutrition",
    items: ["Vitamin C: 36mg", "Vitamin A: 1262 IU", "Calories: 60", "Fiber: 1.6g", "Potassium: 168mg"],
    protein: "0.8g",
    energy: "60 kcal"
  },
  jackfruit: {
    label: "Jackfruit Nutrition",
    items: ["Fiber: 1.5g", "Vitamin C: 13.7mg", "Calories: 95", "Potassium: 303mg", "Magnesium: 37mg"],
    protein: "1.7g",
    energy: "95 kcal"
  },
  curry: {
    label: "Curry Leaf Nutrition",
    items: ["Iron: 0.9mg", "Calcium: 83mg", "Calories: 6", "Vitamin A: 378 IU", "Fiber: 1.3g"],
    protein: "0.5g",
    energy: "6 kcal"
  },
  ginger: {
    label: "Ginger Nutrition",
    items: ["Vitamin B6: 0.2mg", "Magnesium: 43mg", "Calories: 80", "Potassium: 415mg", "Manganese: 0.2mg"],
    protein: "1.8g",
    energy: "80 kcal"
  },
  turmeric: {
    label: "Turmeric Nutrition",
    items: ["Iron: 5mg", "Manganese: 1.6mg", "Calories: 38", "Potassium: 430mg", "Fiber: 2.1g"],
    protein: "1.6g",
    energy: "38 kcal"
  },
  papaya: {
    label: "Papaya Nutrition",
    items: ["Vitamin C: 62mg", "Vitamin A: 1534 IU", "Calories: 43", "Fiber: 1.7g", "Potassium: 257mg"],
    protein: "0.5g",
    energy: "43 kcal"
  },
  pineapple: {
    label: "Pineapple Nutrition",
    items: ["Vitamin C: 48mg", "Manganese: 0.9mg", "Calories: 50", "Fiber: 1.4g", "Vitamin B6: 0.1mg"],
    protein: "0.5g",
    energy: "50 kcal"
  },
  default: {
    label: "Nutrition Info",
    items: ["Fresh farm produce", "Locally grown", "No preservatives", "Naturally ripened", "Organic farming"],
    protein: "Fresh",
    energy: "Natural"
  }
};

export function getNutrition(name) {
  if (!name) return nutritionDB.default;
  const lower = name.toLowerCase().trim();
  for (const [key, data] of Object.entries(nutritionDB)) {
    if (lower.includes(key)) return data;
  }
  return nutritionDB.default;
}

export default nutritionDB;
