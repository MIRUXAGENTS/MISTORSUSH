const menuData = [
  {
    category: "Классические роллы",
    categoryEn: "Classic Rolls",
    items: [
      { id: "c1", name: "Ролл маки с лососем", nameEn: "Salmon Maki Roll", price: 25, ingredients: "Рис, нори, лосось", ingredientsEn: "Rice, nori, salmon" },
      { id: "c2", name: "Ролл маки с тунцом", nameEn: "Tuna Maki Roll", price: 25, ingredients: "Рис, нори, тунец", ingredientsEn: "Rice, nori, tuna" },
      { id: "c3", name: "Маки соломон-авокадо", nameEn: "Salmon-Avocado Maki", price: 27, ingredients: "Рис, нори, лосось, авокадо", ingredientsEn: "Rice, nori, salmon, avocado" },
      { id: "c4", name: "Ролл маки с креветкой", nameEn: "Shrimp Maki Roll", price: 30, ingredients: "Рис, нори, креветка", ingredientsEn: "Rice, nori, shrimp" },
      { id: "c5", name: "Филадельфия с манго", nameEn: "Philadelphia with Mango", price: 51, ingredients: "Рис, нори, кремчиз, соломон, манго", ingredientsEn: "Rice, nori, cream cheese, salmon, mango" },
      { id: "c6", name: "Филадельфия с огурцом", nameEn: "Philadelphia with Cucumber", price: 48, ingredients: "Рис, нори, лосось, кремчиз, огурец", ingredientsEn: "Rice, nori, salmon, cream cheese, cucumber" },
      { id: "c7", name: "Филадельфия с авокадо", nameEn: "Philadelphia with Avocado", price: 50, ingredients: "Рис, нори, лосось, кремчиз, авокадо", ingredientsEn: "Rice, nori, salmon, cream cheese, avocado" },
      { id: "c8", name: "Филадельфия с крабовыми палочками", nameEn: "Philadelphia with Crab Sticks", price: 50, ingredients: "Рис, нори, лосось, кремчиз, крабовые палочки, огурец", ingredientsEn: "Rice, nori, salmon, cream cheese, crab sticks, cucumber" }
    ]
  },
  {
    category: "Запеченные роллы",
    categoryEn: "Baked Rolls",
    items: [
      { id: "z1", name: "Ролл грибной", nameEn: "Mushroom Roll", price: 50, ingredients: "Рис, нори, грибы Шампиньоны, кремчиз, перец болгарский красный, помидор, кунжут, сырный соус", ingredientsEn: "Rice, nori, mushrooms, cream cheese, red bell pepper, tomato, sesame, cheese sauce" },
      { id: "z2", name: "Ролл Белый самурай", nameEn: "White Samurai Roll", price: 60, ingredients: "Рис, нори, лосось, омлет Тамаго, креветка, сырный соус, соус Терияки", ingredientsEn: "Rice, nori, salmon, tamago omelet, shrimp, cheese sauce, teriyaki sauce" },
      { id: "z3", name: "Авокадо хакаси", nameEn: "Avocado Hakasi", price: 55, ingredients: "Рис, нори, лосось, кремчиз, огурец, авокадо, сырный соус, морковка", ingredientsEn: "Rice, nori, salmon, cream cheese, cucumber, avocado, cheese sauce, carrots" },
      { id: "p1", name: "Вегетарианский бум", nameEn: "Vegetarian Boom", price: 36, ingredients: "Рис, нори, перец красный болгарский, огурец, салат зеленый, авокадо, кунжут", ingredientsEn: "Rice, nori, red bell pepper, cucumber, green lettuce, avocado, sesame" },
      { id: "p2", name: "Миндальный ушутоми", nameEn: "Almond Ushutomi", price: 59, ingredients: "Рис, нори, лосось, огурец, кремчиз, соус Терияки, миндаль", ingredientsEn: "Rice, nori, salmon, cucumber, cream cheese, teriyaki sauce, almonds" },
      { id: "p3", name: "Фотумаки шамп", nameEn: "Futomaki Champ", price: 40, ingredients: "Рис, нори, омлет Томаго, огурец, грибы Шампиньоны (жареные)", ingredientsEn: "Rice, nori, tamago omelet, cucumber, fried mushrooms" },
      { id: "p4", name: "Чиз ролл с креветкой", nameEn: "Cheese Roll with Shrimp", price: 55, ingredients: "Рис, нори, креветка, огурец, сыр сливочный, сыр Чеддер", ingredientsEn: "Rice, nori, shrimp, cucumber, cream cheese, cheddar cheese" },
      { id: "p5", name: "Лосось панко", nameEn: "Salmon Panko", price: 47, ingredients: "Рис, нори, лосось слабосолёный, огурец, сливочный сыр, панировочные сухари", ingredientsEn: "Rice, nori, lightly salted salmon, cucumber, cream cheese, breadcrumbs" },
      { id: "p6", name: "Новый год", nameEn: "New Year", price: 60, ingredients: "Рис, нори, лосось, кремчиз, укроп, икра лосося", ingredientsEn: "Rice, nori, salmon, cream cheese, dill, salmon caviar" },
      { id: "p7", name: "Филадельфия с креветкой", nameEn: "Philadelphia with Shrimp", price: 55, ingredients: "Рис, нори, лосось, кремчиз, огурец, креветки", ingredientsEn: "Rice, nori, salmon, cream cheese, cucumber, shrimp" },
      { id: "p8", name: "Травенной ясай маки", nameEn: "Herbal Yasai Maki", price: 55, ingredients: "Рис, нори, огурец, помидор, красный перец болгарский, салат зеленый, кунжут", ingredientsEn: "Rice, nori, cucumber, tomato, red bell pepper, green lettuce, sesame" },
      { id: "p9", name: "Зелёный дракон", nameEn: "Green Dragon", price: 57, ingredients: "Рис, нори, лосось, сливочный сыр, огурец, покрыт авокадо, соус Терияки, кунжут", ingredientsEn: "Rice, nori, salmon, cream cheese, cucumber, covered with avocado, teriyaki sauce, sesame" },
      { id: "p10", name: "Креветка панко", nameEn: "Shrimp Panko", price: 45, ingredients: "Рис, нори, креветка, сливочный сыр, салат зеленый, панировочные сухари", ingredientsEn: "Rice, nori, shrimp, cream cheese, green lettuce, breadcrumbs" },
      { id: "p11", name: "Филадельфия с соломоном", nameEn: "Philadelphia with Salmon", price: 50, ingredients: "Рис, нори, кремчиз, соломон, огурец", ingredientsEn: "Rice, nori, cream cheese, salmon, cucumber" }
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
  }
];
