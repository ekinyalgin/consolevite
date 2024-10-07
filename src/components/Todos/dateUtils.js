// Tarih formatlamak için yardımcı fonksiyon
export const formatDate = (date) => {
	return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())).toISOString().split('T')[0];
};

// Tarihi yerel formatta göstermek için
export const formatDateForDisplay = (dateString) => {
	if (!dateString) return '';
	const date = new Date(dateString);
	return date.toLocaleDateString('tr-TR');
};

export const groupTodosByDate = (todos) => {
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const yesterday = new Date(today);
	yesterday.setDate(today.getDate() - 1);
	const tomorrow = new Date(today);
	tomorrow.setDate(today.getDate() + 1);

	const grouped = todos.reduce((groupedTodos, todo) => {
		const todoDate = todo.date ? new Date(todo.date) : null;
		todoDate && todoDate.setHours(0, 0, 0, 0);
		let groupKey = todo.date;

		if (todoDate) {
			if (todoDate.getTime() === today.getTime()) {
				groupKey = "Today";
			} else if (todoDate.getTime() === yesterday.getTime()) {
				groupKey = "Yesterday";
			} else if (todoDate.getTime() === tomorrow.getTime()) {
				groupKey = "Tomorrow";
			} else {
				groupKey = todoDate.toLocaleDateString('tr-TR');
			}
		}

		if (!groupedTodos[groupKey]) {
			groupedTodos[groupKey] = [];
		}
		groupedTodos[groupKey].push(todo);
		return groupedTodos;
	}, {});

	const sortDates = (a, b) => {
		const specialDates = { "Yesterday": yesterday, "Today": today, "Tomorrow": tomorrow };
		const dateA = specialDates[a] || new Date(a.split('.').reverse().join('-'));
		const dateB = specialDates[b] || new Date(b.split('.').reverse().join('-'));
		return dateA - dateB;
	};

	const sortedGroups = Object.keys(grouped).sort(sortDates);

	const orderedTodos = {};
	sortedGroups.forEach((key) => {
		orderedTodos[key] = grouped[key];
	});

	return orderedTodos;
};