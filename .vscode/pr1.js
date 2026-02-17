const expenseTracker = {
  expenses: [],

  // Генерируем id (djpvj;yj lf;t eybrfkmyst)
  _generateId() {
    return this.expenses.length ? this.expenses[this.expenses.length - 1].id + 1 : 1;
  },

  // Проверка корректности ввода
  _validateExpenseInput(title, amount, category) {
    if (typeof title !== 'string' || title.trim() === '') {
      console.error('Ошибка: Название должно быть непустой строкой');
      return false;
    }
    if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
      console.error('Ошибка: Сумма должна быть числом больше 0');
      return false;
    }
    if (typeof category !== 'string' || category.trim() === '') {
      console.error('Ошибка: Категория должна быть непустой строкой');
      return false;
    }
    return true;
  },

  // 1. Добавляем куда потратили свои шейкели (метод addExpense)
  addExpense(title, amount, category) {
    if (!this._validateExpenseInput(title, amount, category)) {
      return;
    }
    const newExpense = {
      id: this._generateId(),
      title: title.trim(),
      amount,
      category: category.trim()
    };
    this.expenses.push(newExpense);
    console.log('Расход добавлен:', newExpense);
  },

  // 2. Вывод всего куда потратились (всех расходов) (printAllExpenses)
  printAllExpenses() {
    if (this.expenses.length === 0) {
      console.log('Список расходов пуст.');
      return;
    }
    console.log('Все расходы:');
    this.expenses.forEach(e => {
      console.log(`ID: ${e.id}, Название: "${e.title}", Сумма: ${e.amount.toFixed(2)}, Категория: ${e.category}`);
    });
  },

  // 3. Подсчёт общего баланса
  getTotalAmount() {
    const total = this.expenses.reduce((sum, e) => sum + e.amount, 0);
    console.log(`Общий расход: ${total.toFixed(2)} единиц.`);
    return total;
  },

  // 4. Фильтрация по категории
  getExpensesByCategory(category) {
    if (typeof category !== 'string' || category.trim() === '') {
      console.error('Ошибка: Введите корректную категорию для фильтрации');
      return [];
    }
    const filtered = this.expenses.filter(e => e.category.toLowerCase() === category.trim().toLowerCase());
    if (filtered.length === 0) {
      console.log(`Расходы по категории "${category}" не найдены.`);
      return filtered;
    }
    const totalByCategory = filtered.reduce((sum, e) => sum + e.amount, 0);
    console.log(`Расходы по категории "${category}":`);
    filtered.forEach(e => {
      console.log(`ID: ${e.id}, Название: "${e.title}", Сумма: ${e.amount.toFixed(2)}`);
    });
    console.log(`Итого потрачено в категории "${category}": ${totalByCategory.toFixed(2)}`);
    return filtered;
  },

  // 5. Поиск расхода по части названия + возможность добавить "доп. строку" (то есть, дополнительное поле)
  findExpenseByTitle(searchString) {
    if (typeof searchString !== 'string' || searchString.trim() === '') {
      console.error('Ошибка: Введите строку для поиска');
      return null;
    }
    const found = this.expenses.find(e => e.title.toLowerCase().includes(searchString.trim().toLowerCase()));
    if (!found) {
      console.log(`Расход с названием, содержащим "${searchString}" не найден.`);
      return null;
    }
    console.log('Найденный расход:', found);
    return found;
  },

  // 7. Доп. функционал
  // Удаление расхода по id
  removeExpenseById(id) {
    if (typeof id !== 'number' || isNaN(id) || id <= 0) {
      console.error('Ошибка: Нужно указать корректный числовой id');
      return false;
    }
    const index = this.expenses.findIndex(e => e.id === id);
    if (index === -1) {
      console.log(`Расход с ID ${id} не найден.`);
      return false;
    }
    const removed = this.expenses.splice(index, 1)[0];
    console.log('Удалён расход:', removed);
    return true;
  },

  // Вывод статистики по категориям
  printStatisticsByCategory() {
    if (this.expenses.length === 0) {
      console.log('Расходов нет для статистики.');
      return;
    }
    const stats = {};
    this.expenses.forEach(e => {
      const cat = e.category.toLowerCase();
      stats[cat] = (stats[cat] || 0) + e.amount;
    });
    console.log('Статистика по категориям:');
    for (const [cat, amount] of Object.entries(stats)) {
      console.log(`Категория "${cat}": ${amount.toFixed(2)}`);
    }
  }
};

// Пример :)
expenseTracker.addExpense('Кофе', 3.5, 'Еда');
expenseTracker.addExpense('Бензин', 20, 'Транспорт');
expenseTracker.addExpense('Обед в кафе', 12, 'Еда');

expenseTracker.printAllExpenses();
expenseTracker.getTotalAmount();
expenseTracker.getExpensesByCategory('Еда');
expenseTracker.findExpenseByTitle('кофе'); // смотреть

expenseTracker.removeExpenseById(2);
expenseTracker.printAllExpenses();

expenseTracker.printStatisticsByCategory();
