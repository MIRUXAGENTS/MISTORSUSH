const menuData = [
  {
    category: "Классические роллы",
    categoryEn: "Classic Rolls",
    items: [
      { id: "c1", name: "Маки Лосось", nameEn: "Salmon Maki", price: 30, ingredients: "", ingredientsEn: "" },
      { id: "c2", name: "Маки Авокадо", nameEn: "Avocado Maki", price: 28, ingredients: "", ingredientsEn: "" },
      { id: "c3", name: "Маки Кампье", nameEn: "Kampye Maki", price: 25, ingredients: "", ingredientsEn: "" },
      { id: "c4", name: "Маки Огурец", nameEn: "Cucumber Maki", price: 25, ingredients: "", ingredientsEn: "" },
      { id: "c5", name: "Маки Морковка", nameEn: "Carrot Maki", price: 25, ingredients: "", ingredientsEn: "" },
      { id: "c6", name: "Маки Ассорти", nameEn: "Assorted Maki", price: 35, ingredients: "", ingredientsEn: "" },
      { id: "c7", name: "Филадельфия", nameEn: "Philadelphia", price: 45, ingredients: "Рис, огурец, кремчиз, лосось сверху", ingredientsEn: "Rice, cucumber, cream cheese, salmon on top" },
      { id: "c8", name: "Филадельфия Крабовые палочки", nameEn: "Crab Stick Philadelphia", price: 50, ingredients: "Рис, огурец, кремчиз, крабовые палочки, лосось сверху", ingredientsEn: "Rice, cucumber, cream cheese, crab sticks, salmon on top" },
      { id: "c9", name: "Филадельфия Лосось", nameEn: "Salmon Philadelphia", price: 50, ingredients: "Рис, лосось, огурец, кремчиз, лосось сверху", ingredientsEn: "Rice, salmon, cucumber, cream cheese, salmon on top" },
      { id: "c10", name: "Филадельфия Авокадо", nameEn: "Avocado Philadelphia", price: 55, ingredients: "Рис, авокадо, огурец, кремчиз, лосось сверху", ingredientsEn: "Rice, avocado, cucumber, cream cheese, salmon on top" },
      { id: "c11", name: "Филадельфия Осмаленная", nameEn: "Seared Philadelphia", price: 50, ingredients: "Рис, огурец, кремчиз, лосось сверху", ingredientsEn: "Rice, cucumber, cream cheese, salmon on top" },
      { id: "c12", name: "Филадельфия Тамаго", nameEn: "Philadelphia Tamago", price: 45, ingredients: "Рис, омлет тамаго, огурец, кремчиз, лосось сверху", ingredientsEn: "Rice, tamago omelet, cucumber, cream cheese, salmon on top" },
      { id: "c13", name: "Зеленый дракон", nameEn: "Green Dragon", price: 60, ingredients: "Рис, огурец, кремчиз, лосось сверху, авокадо, терияки, кунжут", ingredientsEn: "Rice, cucumber, cream cheese, salmon on top, covered with avocado, teriyaki sauce, sesame" },
      { id: "c14", name: "Красный дракон", nameEn: "Red Dragon", price: 65, ingredients: "Рис, укроп, кремчиз, лосось сверху, шапка из икры", ingredientsEn: "Rice, dill, cream cheese, salmon on top, caviar topping" },
      { id: "c15", name: "Креветка Панко (не жаренный)", nameEn: "Panko Shrimp (non-fried)", price: 45, ingredients: "Рис, кремчиз, креветка, хасса, панировочные сухари", ingredientsEn: "Rice, cream cheese, shrimp, lettuce, breadcrumbs" },
      { id: "c16", name: "Лосось Панко (не жаренный)", nameEn: "Panko Salmon (non-fried)", price: 50, ingredients: "Рис, кремчиз, лосось, хасса, панировочные сухари", ingredientsEn: "Rice, cream cheese, salmon, lettuce, breadcrumbs" },
      { id: "c17", name: "Сырная креветка", nameEn: "Cheese Shrimp", price: 50, ingredients: "Рис, кремчиз, креветка, огурец, сыр чеддер сверху", ingredientsEn: "Rice, cream cheese, shrimp, cucumber, cheddar cheese on top" },
      { id: "c18", name: "Закрытый грибник", nameEn: "Hidden Mushroom", price: 55, ingredients: "Рис, кремчиз, огурец, грибы шампиньоны (жаренные)", ingredientsEn: "Rice, cream cheese, cucumber, fried mushrooms" },
      { id: "c19", name: "Веганский рай", nameEn: "Vegan Paradise", price: 45, ingredients: "Рис, морковка, батат (запеченный), огурец, хасса, кампье", ingredientsEn: "Rice, carrot, sweet potato (baked), cucumber, lettuce, kanpyo" },
      { id: "c20", name: "Морской бриз", nameEn: "Sea Breeze", price: 55, ingredients: "Рис, креветка, кремчиз, сверху морская капуста, кунжут", ingredientsEn: "Rice, shrimp, cream cheese, seaweed on top, sesame" },
      { id: "c21", name: "Калифорния", nameEn: "California", price: 60, ingredients: "Рис, лосось, кремчиз, огурец, сверху оранжевая тобика", ingredientsEn: "Rice, salmon, cream cheese, cucumber, orange tobiko on top" }
    ]
  },
  {
    category: "Запеченные роллы",
    categoryEn: "Baked Rolls",
    items: [
      { id: "z1", name: "Грибной Амур", nameEn: "Mushroom Amur", price: 60, ingredients: "Рис, грибы шампиньоны, кремчиз, красный болгарский перец, помидор, сырная шапка", ingredientsEn: "Rice, mushrooms, cream cheese, red bell pepper, tomato, cheese topping" },
      { id: "z2", name: "Белый самурай", nameEn: "White Samurai", price: 60, ingredients: "Рис, лосось, омлет тамаго, креветка, сырная шапка, сверху кунжут и терияки", ingredientsEn: "Rice, salmon, tamago omelet, shrimp, cheese topping, sesame and teriyaki on top" },
      { id: "z3", name: "Бурный авокадо", nameEn: "Stormy Avocado", price: 60, ingredients: "Рис, лосось, авокадо, морковка, огурец, сырная шапка", ingredientsEn: "Rice, salmon, avocado, carrot, cucumber, cheese topping" },
      { id: "z4", name: "Веган бум", nameEn: "Vegan Boom", price: 55, ingredients: "Рис, авокадо, морковка, огурец, кампье, хасса, сырная шапка, терияки и кунжут", ingredientsEn: "Rice, avocado, carrot, cucumber, kanpyo, lettuce, cheese topping, teriyaki and sesame" }
    ]
  },
  {
    category: "Необычные роллы",
    categoryEn: "Unusual Rolls",
    items: [
      { id: "u1", name: "Закрытый лосось", nameEn: "Hidden Salmon", price: 60, ingredients: "Лосось, кремчиз, огурец, лосось", ingredientsEn: "Salmon, cream cheese, cucumber, salmon" },
      { id: "u2", name: "Ошаленный ролл", nameEn: "Crazy Roll", price: 55, ingredients: "Лосось, кремчиз, огурец, огурец", ingredientsEn: "Salmon, cream cheese, cucumber, cucumber" },
      { id: "u3", name: "Наглая креветка", nameEn: "Cheeky Shrimp", price: 55, ingredients: "Креветка, кремчиз, огурец, огурец", ingredientsEn: "Shrimp, cream cheese, cucumber, cucumber" },
      { id: "u4", name: "Веган", nameEn: "Vegan", price: 45, ingredients: "Огурец, морковка, помидор, хасса, омлет тамаго", ingredientsEn: "Cucumber, carrot, tomato, lettuce, tamago omelet" }
    ]
  },
  {
    category: "Рисовые гамбургеры",
    categoryEn: "Rice Burgers",
    items: [
      { id: "b1", name: "Рисовый гамбургер", nameEn: "Rice Burger", price: 55, ingredients: "Начинки на выбор. Жаренные появятся позже", ingredientsEn: "Choice of fillings. Fried options coming soon" }
    ]
  },
  {
    category: "Гункан и суши",
    categoryEn: "Gunkan and Sushi",
    items: [
      { id: "g1", name: "Гункан и суши", nameEn: "Gunkan and Sushi", price: 50, ingredients: "Начинки на выбор. Жаренные появятся позже", ingredientsEn: "Choice of fillings. Fried options coming soon" }
    ]
  },
  {
    category: "Напитки",
    categoryEn: "Drinks",
    items: [
      { id: "d1", name: "Кока-Кола", nameEn: "Coca-Cola", price: 12, ingredients: "0.33 л", ingredientsEn: "0.33 L", image: "img/drinks/coca_cola_p.webp" },
      { id: "d2", name: "Кока-Кола Зеро", nameEn: "Coca-Cola Zero", price: 12, ingredients: "0.33 л", ingredientsEn: "0.33 L", image: "img/drinks/coca_cola_zero_p.webp" },
      { id: "d3", name: "Спрайт", nameEn: "Sprite", price: 12, ingredients: "0.33 л", ingredientsEn: "0.33 L", image: "img/drinks/sprite.webp" },
      { id: "d4", name: "Спрайт Зеро", nameEn: "Sprite Zero", price: 12, ingredients: "0.33 л", ingredientsEn: "0.33 L", image: "img/drinks/sprite_zero.webp" }
    ]
  },
  {
    category: "Соусы",
    categoryEn: "Sauces",
    items: [
      { id: "s1", name: "Соевый соус", nameEn: "Soy Sauce", price: 2, ingredients: "", ingredientsEn: "", image: "img/sause/Soy_Sauce.webp" },
      { id: "s2", name: "Соус Терияки", nameEn: "Teriyaki Sauce", price: 2, ingredients: "", ingredientsEn: "", image: "img/sause/Teriyaki_Sauce.webp" },
      { id: "s3", name: "Васаби", nameEn: "Wasabi", price: 2, ingredients: "", ingredientsEn: "", image: "img/sause/wasabi.webp" },
      { id: "s4", name: "Имбирь", nameEn: "Ginger", price: 2, ingredients: "", ingredientsEn: "", image: "img/sause/ginger.webp" }
    ]
  }
];
