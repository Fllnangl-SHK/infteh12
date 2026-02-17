const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false
});

const expenseTracker = {
  expenses: [],
  nextId: 1,

  addExpense(title, amount, category) {
    if (!title || typeof title !== 'string' || title.trim() === '') {
      console.log('Ошибка: название расхода должно быть непустой строкой.');
      return;
    }
    if (typeof amount !== 'number' || amount <= 0 || isNaN(amount)) {
      console.log('Ошибка: сумма должна быть положительным числом.');
      return;
    }
    if (!category || typeof category !== 'string' || category.trim() === '') {
      console.log('Ошибка: категория должна быть непустой строкой.');
      return;
    }

    const expense = {
      id: this.nextId++,
      title: title.trim(),
      amount,
      category: category.trim()
    };
    this.expenses.push(expense);
    console.log('Расход добавлен.');
  },

  printAllExpenses() {
    if (this.expenses.length === 0) {
      console.log('Расходы отсутствуют.');
      return;
    }
    console.log('\nВсе расходы:');
    this.expenses.forEach(e => {
      console.log(`ID: ${e.id} | ${e.title} | Сумма: ${e.amount} | Категория: ${e.category}`);
    });
  },

  getTotalAmount() {
    const total = this.expenses.reduce((sum, e) => sum + e.amount, 0);
    console.log(`\nОбщая сумма расходов: ${total.toFixed(2)}`);
    return total;
  },

  getExpensesByCategory(category) {
    if (!category || category.trim() === '') {
      console.log('Ошибка: категория должна быть непустой строкой.');
      return [];
    }
    const filtered = this.expenses.filter(e => e.category.toLowerCase() === category.trim().toLowerCase());
    if (filtered.length === 0) {
      console.log(`Расходы по категории "${category}" не найдены.`);
      return [];
    }
    const totalByCat = filtered.reduce((sum, e) => sum + e.amount, 0);
    console.log(`\nРасходы по категории "${category}":`);
    filtered.forEach(e => {
      console.log(`ID: ${e.id} | ${e.title} | Сумма: ${e.amount}`);
    });
    console.log(`Всего потрачено в категории "${category}": ${totalByCat.toFixed(2)}`);
    return filtered;
  },

  findExpenseByTitle(str) {
    if (!str || str.trim() === '') {
      console.log('Ошибка: строка поиска должна быть непустой.');
      return null;
    }
    const found = this.expenses.find(e => e.title.toLowerCase().includes(str.trim().toLowerCase()));
    if (!found) {
      console.log(`Расход с названием, содержащим "${str}", не найден.`);
      return null;
    }
    console.log('Найден расход:');
    console.log(`ID: ${found.id} | ${found.title} | Сумма: ${found.amount} | Категория: ${found.category}`);
    return found;
  },

  removeExpenseById(id) {
    const index = this.expenses.findIndex(e => e.id === id);
    if (index === -1) {
      console.log(`Расход с ID ${id} не найден.`);
      return false;
    }
    this.expenses.splice(index, 1);
    console.log(`Расход с ID ${id} удалён.`);
    return true;
  },

  printCategoryStatistics() {
    if (this.expenses.length === 0) {
      console.log('Статистика по категориям отсутствует — нет расходов.');
      return;
    }
    const stats = {};
    this.expenses.forEach(e => {
      const cat = e.category;
      if (!stats[cat]) stats[cat] = 0;
      stats[cat] += e.amount;
    });
    console.log('\nСтатистика расходов по категориям:');
    for (const cat in stats) {
      console.log(`Категория: ${cat} | Общая сумма: ${stats[cat].toFixed(2)}`);
    }
  }
};

function prompt(question) {
  return new Promise(resolve => rl.question(question, answer => resolve(answer)));
}

async function mainMenu() {
  while (true) {
    console.log('\nПерсональный трекер расходов');
    console.log('1. Добавить расход');
    console.log('2. Показать все расходы');
    console.log('3. Показать общую сумму расходов');
    console.log('4. Показать расходы по категории');
    console.log('5. Найти расход по названию');
    console.log('6. Удалить расход по ID');
    console.log('7. Показать статистику по категориям');
    console.log('0. Выход');

    const choice = await prompt('Выберите действие: ');

    switch(choice.trim()) {
      case '1': {
        const title = await prompt('Введите название расхода: ');
        const amountStr = await prompt('Введите сумму: ');
        const amount = parseFloat(amountStr);
        const category = await prompt('Введите категорию: ');
        expenseTracker.addExpense(title, amount, category);
        break;
      }
      case '2':
        expenseTracker.printAllExpenses();
        break;
      case '3':
        expenseTracker.getTotalAmount();
        break;
      case '4': {
        const category = await prompt('Введите категорию: ');
        expenseTracker.getExpensesByCategory(category);
        break;
      }
      case '5': {
        const str = await prompt('Введите часть названия для поиска: ');
        expenseTracker.findExpenseByTitle(str);
        break;
      }
      case '6': {
        const idStr = await prompt('Введите ID расхода для удаления: ');
        const id = parseInt(idStr);
        if (isNaN(id)) {
          console.log('Некорректный ID.');
          break;
        }
        expenseTracker.removeExpenseById(id);
        break;
      }
      case '7':
        expenseTracker.printCategoryStatistics();
        break;
      case '0':
        console.log('Выход из программы. До свидания!');
        rl.close();
        return;
      default:
        console.log('Неверный выбор, попробуйте снова.');
    }
  }
}

// Выпускайте кракена
mainMenu();