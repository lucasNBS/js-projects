const LOCAL_STORAGE_LIST_KEY = "task.lists";
const LOCAL_STORAGE_SELECTED_LIST_ID_KEY = "task.selectedListIdKey";

const listsContainerElement = document.querySelector("[data-lists]");
const listDisplayContainerElement = document.querySelector(
  "[data-list-display]"
);
const listTitleElement = document.querySelector("[data-list-title]");
const listCountElement = document.querySelector("[data-list-count]");
const tasksContainerElement = document.querySelector("[data-tasks]");

const taskTemplateElement = document.querySelector("#task-template");

const newListFormElement = document.querySelector("[data-new-list-form]");
const newListInputElement = document.querySelector("[data-new-list-input]");
const deleteListButtonElement = document.querySelector(
  "[data-delete-list-button]"
);

const newTaskFormElement = document.querySelector("[data-new-task-form]");
const newTaskInputElement = document.querySelector("[data-new-task-input]");
const clearCompleteTasksButtonElement = document.querySelector(
  "[data-clear-complete-tasks-button]"
);

let lists = JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || [];
let selectedListId = JSON.parse(
  localStorage.getItem(LOCAL_STORAGE_SELECTED_LIST_ID_KEY)
);

listsContainerElement.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "li") {
    selectedListId = e.target.dataset.listId;
    save();
    render();
  }
});

tasksContainerElement.addEventListener("click", (e) => {
  if (e.target.tagName.toLowerCase() === "input") {
    const selectedList = getSelectedList();
    const selectedTask = selectedList.tasks.find(
      (task) => task.id === e.target.id
    );

    selectedTask.completed = e.target.checked;

    save();
    renderTasksCount(selectedList);
  }
});

deleteListButtonElement.addEventListener("click", (e) => {
  lists = lists.filter((list) => list.id !== selectedListId);
  selectedListId = null;
  save();
  render();
});

clearCompleteTasksButtonElement.addEventListener("click", (e) => {
  const selectedList = getSelectedList();
  selectedList.tasks = selectedList.tasks.filter((task) => !task.completed);
  save();
  render();
});

newListFormElement.addEventListener("submit", (e) => {
  e.preventDefault();
  const listName = newListInputElement.value;

  if (listName == null || listName === "") return;

  const list = createList(listName);

  newListInputElement.value = null;
  lists.push(list);
  save();

  render();
});

function getSelectedList() {
  return lists.find((list) => list.id === selectedListId);
}

newTaskFormElement.addEventListener("submit", (e) => {
  e.preventDefault();
  const taskName = newTaskInputElement.value;

  if (taskName == null || taskName === "") return;

  const task = createTask(taskName);

  newTaskInputElement.value = null;
  const selectedList = getSelectedList();
  selectedList.tasks.push(task);

  save();
  render();
});

function createList(name) {
  return {
    id: Date.now().toString(),
    name: name,
    tasks: [],
  };
}

function createTask(name) {
  return { id: Date.now().toString(), name: name, completed: false };
}

function save() {
  localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
  localStorage.setItem(
    LOCAL_STORAGE_SELECTED_LIST_ID_KEY,
    JSON.stringify(selectedListId)
  );
}

function render() {
  clearElement(listsContainerElement);
  renderLists();

  const selectedList = getSelectedList();

  if (selectedListId == null) {
    listDisplayContainerElement.style.display = "none";
  } else {
    listDisplayContainerElement.style.display = "";
    listTitleElement.innerText = selectedList.name;
    renderTasksCount(selectedList);
    clearElement(tasksContainerElement);
    renderTasks(selectedList);
  }
}

function renderTasksCount(selectedList) {
  const incompleteTaskCount = selectedList.tasks.filter(
    (task) => !task.completed
  ).length;

  listCountElement.innerText = `${incompleteTaskCount} ${
    incompleteTaskCount === 1 ? "task" : "tasks"
  } remaining`;
}

function renderLists() {
  lists.forEach((list) => {
    const listElement = document.createElement("li");
    listElement.dataset.listId = list.id;
    listElement.classList.add("list-name");
    listElement.innerText = list.name;

    if (list.id === selectedListId) {
      listElement.classList.add("active-list");
    }

    listsContainerElement.append(listElement);
  });
}

function renderTasks(selectedList) {
  selectedList.tasks.forEach((task) => {
    const taskElement = document.importNode(taskTemplateElement.content, true);

    const checkboxElement = taskElement.querySelector("input");
    const labelElement = taskElement.querySelector("label");

    checkboxElement.id = task.id;
    checkboxElement.checked = task.completed;

    labelElement.htmlFor = task.id;
    labelElement.append(task.name);
    tasksContainerElement.appendChild(taskElement);
  });
}

function clearElement(element) {
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

render();
