const tasks = [];

function handleFormSubmit(event) {
	event.preventDefault();

	const formData = new FormData(event.target);
	const task = Object.fromEntries(formData);

	task.title = task.title.trim();
	task.description = task.description.trim();

	const errorMessage = document.getElementById("error-message");

	// VALIDACIONES
	if (task.title === "") {
		errorMessage.textContent = "El título no puede estar vacío";
		return;
	}

	if (task.title.length < 3) {
		errorMessage.textContent = "El título debe tener mínimo 3 caracteres";
		return;
	}

	if (task.description.length > 100) {
		errorMessage.textContent = "La descripción no puede superar 100 caracteres";
		return;
	}

	const duplicatedTask = tasks.find(
		(t) => t.title.toLowerCase() === task.title.toLowerCase()
	);

	if (duplicatedTask) {
		errorMessage.textContent = "Ya existe una tarea con ese título";
		return;
	}

	errorMessage.textContent = "";

	task.id = Date.now();
	task.createdAt = new Date().toLocaleString();

	tasks.push(task);

	const taskElement = createTaskElement(task);

	const ulContainer = document.getElementById("task-list-container");

	if (!ulContainer) return;

	ulContainer.appendChild(taskElement);

	event.target.reset();
}

function createTaskElement(task) {

	// CONTENIDO
	const divTaskContent = document.createElement("div");
	divTaskContent.classList.add("task-content");

	const h3Title = document.createElement("h3");
	h3Title.textContent = task.title;

	const pDescription = document.createElement("p");
	pDescription.textContent = task.description;

	const smallDate = document.createElement("small");
	smallDate.textContent = `📅 ${task.createdAt}`;

	divTaskContent.appendChild(h3Title);
	divTaskContent.appendChild(pDescription);
	divTaskContent.appendChild(smallDate);

	// ACCIONES
	const divTaskAction = document.createElement("div");
	divTaskAction.classList.add("task-actions");

	// BOTÓN EDITAR
	const editButton = document.createElement("button");
	editButton.textContent = "📝Editar";

	editButton.addEventListener("click", () => {
		enableEditTask(task.id);
	});

	// BOTÓN ELIMINAR
	const deleteButton = document.createElement("button");
	deleteButton.textContent = "🗑Eliminar";

	deleteButton.addEventListener("click", () => {
		deleteTaskElement(task.id);
	});

	divTaskAction.appendChild(editButton);
	divTaskAction.appendChild(deleteButton);

	// LI
	const li = document.createElement("li");
	li.classList.add("task-item");
	li.id = task.id;

	li.appendChild(divTaskContent);
	li.appendChild(divTaskAction);

	return li;
}

function deleteTaskElement(taskId) {

	const confirmDelete = 
	confirm("Deseas eliminar esta tarea?");

	if (!confirmDelete) return;
	
	const li = document.getElementById(taskId);

	li.remove();

	const taskIndex = tasks.findIndex((task) => task.id === taskId);

	tasks.splice(taskIndex, 1);
}

// EDITAR TAREA
function enableEditTask(taskId) {

	const li = document.getElementById(taskId);

	const task = tasks.find((task) => task.id === taskId);

	if (!task) return;

	li.innerHTML = `
		<div class="edit-container">
			<input type="text" id="edit-title-${task.id}" value="${task.title}">
			
			<textarea id="edit-description-${task.id}" rows="4">${task.description}</textarea>

			<div class="edit-buttons">
				<button onclick="saveTask(${task.id})">💾Guardar</button>
				<button onclick="cancelEdit(${task.id})">❌Cancelar</button>
			</div>
		</div>
	`;
}

// GUARDAR CAMBIOS
function saveTask(taskId) {

	const task = tasks.find((task) => task.id === taskId);

	if (!task) return;

	const newTitle = document
		.getElementById(`edit-title-${taskId}`)
		.value.trim();

	const newDescription = document
		.getElementById(`edit-description-${taskId}`)
		.value.trim();

	// VALIDACIONES
	if (newTitle === "") {
		alert("El título no puede estar vacío");
		return;
	}

	if (newTitle.length < 3) {
		alert("El título debe tener mínimo 3 caracteres");
		return;
	}

	if (newDescription.length > 100) {
		alert("La descripción no puede superar 100 caracteres");
		return;
	}

	const duplicatedTask = tasks.find(
		(t) =>
			t.title.toLowerCase() === newTitle.toLowerCase() &&
			t.id !== taskId
	);

	if (duplicatedTask) {
		alert("Ya existe una tarea con ese título");
		return;
	}

	task.title = newTitle;
	task.description = newDescription;

	const updatedTask = createTaskElement(task);

	const oldLi = document.getElementById(taskId);

	oldLi.replaceWith(updatedTask);
}

// CANCELAR EDICIÓN
function cancelEdit(taskId) {

	const task = tasks.find((task) => task.id === taskId);

	if (!task) return;

	const originalTask = createTaskElement(task);

	const oldLi = document.getElementById(taskId);

	oldLi.replaceWith(originalTask);
}

// 	const liTemplate = `
// <li id="${task.id}" class="task-item">
// 	<div class="task-content">
// 			<h3>${task.title}</h3>
// 			<p>${task.description}</p>
// 	</div>
// 	<div class="task-actions">
// 			<button onclick="deleteTaskElement(${task.id})">Eliminar</button>
// 	</div>
// </li>`;

// 	return liTemplate;