const form = document.querySelector("#taskForm");
const input = document.querySelector("#taskInput");
const list = document.querySelector("#tasksList");
const btns = document.querySelector("#activeBtns");
const deletedList = document.querySelector("#deletedList");
const showBtn = document.querySelector("#showBtn");

form.addEventListener("submit", addTask);
list.addEventListener("click", deleteTask);
list.addEventListener("click", doneTask);
btns.addEventListener("click", hltEvenIndex);
btns.addEventListener("click", hltOddIndex);
btns.addEventListener("click", dltFstElem);
btns.addEventListener("click", dltLstElem);
deletedList.addEventListener("click", returnTask);
deletedList.addEventListener("click", strongDelete);

let tasks = [];
if (localStorage.getItem("tasks")) {
  tasks = JSON.parse(localStorage.getItem("tasks"));
  tasks.forEach((task) => {
    renderTask(task);
  });
}
checkIfEmpty();

let dltdTasks = [];
if (localStorage.getItem("dltdTasks")) {
  dltdTasks = JSON.parse(localStorage.getItem("dltdTasks"));
  dltdTasks.forEach((task) => {
    renderDltdTask(task);
  });
}
checkIfEmptyDltd();

function addTask(e) {
  e.preventDefault();

  const taskText = taskInput.value;
  taskInput.value = "";
  taskInput.focus();

  const task = {
    id: new Date().getTime(),
    text: taskText,
    done: false,
  };

  tasks.push(task);

  checkIfEmpty();

  renderTask(task);

  toLocalStorage("tasks", tasks);
}

function doneTask(e) {
  if (e.target.dataset.action != "done") {
    return;
  }

  const taskLi = e.target.closest("li");
  const liSpan = taskLi.querySelector("span");
  const parentId = taskLi.id;

  liSpan.classList.add("taskName_done");

  const index = tasks.findIndex((el) => el.id == parentId);
  const el = tasks[index];
  if (el.done) {
    return;
  }
  el.done = true;
  tasks.push(el);
  tasks.splice(index, 1);

  list.appendChild(taskLi);

  toLocalStorage("tasks", tasks);
}

function deleteTask(e) {
  if (e.target.dataset.action != "delete") {
    return;
  }

  const taskLi = e.target.closest("li");
  const parentId = taskLi.id;

  const index = tasks.findIndex((el) => el.id == parentId);
  dltdTasks.push(tasks[index]);
  renderDltdTask(tasks[index]);
  tasks.splice(index, 1);
  taskLi.remove();

  checkIfEmpty();
  checkIfEmptyDltd();

  toLocalStorage("tasks", tasks);
  toLocalStorage("dltdTasks", dltdTasks);
}

function lightEvenEl(e) {
  const taskLi = e.target.closest("li");
  const parentId = taskLi.id;
  taskLi.classList.toggle("taskItem_highlight");
}

function checkIfEmpty() {
  if (tasks.length == 0) {
    const emptyList = `
    <div class="taskList_empty" id="emptyList">Список дел пуст</div>`;
    list.insertAdjacentHTML("afterbegin", emptyList);
  }
  if (tasks.length > 0) {
    const emptyList = document.querySelector("#emptyList");
    emptyList ? emptyList.remove() : null;
  }
}

function checkIfEmptyDltd() {
  if (dltdTasks.length == 0) {
    showBtn.classList.add("d-n");
    deletedList.classList.add("d-n");
  } else {
    showBtn.classList.remove("d-n");
  }
}

function renderTask(task) {
  const cssClass = task.done ? "taskName taskName_done" : "taskName";
  const taskHtml = `
  <li id="${task.id}" class="taskItem">
  <span class="${cssClass}">${task.text}</span>
  <div class="taskBtns">
    <button data-action="done">
      <img src="img/icons8-галочка2.svg" alt="done" />
    </button>
    <button data-action="delete">
      <img src="img/icons8-удалить2.svg" alt="delete" />
    </button>
  </div>
</li>`;
  tasksList.insertAdjacentHTML("beforeend", taskHtml);
}

function toLocalStorage(elemName, elem) {
  localStorage.setItem(`${elemName}`, JSON.stringify(elem));
}

function hltEvenIndex(e) {
  if (e.target.dataset.action != "hltEvenIndex") {
    return;
  }

  const liElements = list.querySelectorAll("li");
  liElements.forEach((el, index) => {
    if (index % 2 != 0) {
      el.classList.toggle("taskItem_highlight");
    } else {
      el.classList.remove("taskItem_highlight");
    }
  });
}

function hltOddIndex(e) {
  if (e.target.dataset.action != "hltOddIndex") {
    return;
  }

  const liElements = list.querySelectorAll("li");
  liElements.forEach((el, index) => {
    if (index % 2 == 0) {
      el.classList.toggle("taskItem_highlight");
    } else {
      el.classList.remove("taskItem_highlight");
    }
  });
}

function dltFstElem(e) {
  if (e.target.dataset.action != "dltFstElem") {
    return;
  }

  const liElement = list.querySelector("li");
  liElement.remove();
  tasks.splice(0, 1);
  toLocalStorage("tasks", tasks);
  checkIfEmpty();
}

function dltLstElem(e) {
  if (e.target.dataset.action != "dltLstElem") {
    return;
  }
  const liElements = list.querySelectorAll("li");
  liElements[liElements.length - 1].remove();
  tasks.splice(tasks.length - 1, 1);
  toLocalStorage("tasks", tasks);
  checkIfEmpty();
}

function renderDltdTask(task) {
  const taskHtml = `
  <li id="${task.id}" class="taskItem">
              <span>${task.text}</span>
              <div class="taskBtns">
                <button data-action="return">
                  <img src="img/return-svgrepo-com (1).svg" alt="delete" />
                </button>
                <button data-action="strongDelete">
      <img src="img/icons8-удалить2.svg" alt="delete" />
    </button>
              </div>
            </li>`;
  deletedList.insertAdjacentHTML("beforeend", taskHtml);
}

function shwDltd() {
  deletedList.classList.toggle("d-n");
}

function returnTask(e) {
  if (e.target.dataset.action != "return") {
    return;
  }

  const taskLi = e.target.closest("li");
  const liSpan = taskLi.querySelector("span");
  const parentId = taskLi.id;

  const index = dltdTasks.findIndex((el) => el.id == parentId);
  const el = dltdTasks[index];
  el.done = false;
  tasks.push(el);
  dltdTasks.splice(index, 1);
  taskLi.remove();

  renderTask(el);

  checkIfEmpty();
  checkIfEmptyDltd();
  toLocalStorage("tasks", tasks);

  toLocalStorage("dltdTasks", dltdTasks);
}

function strongDelete(e) {
  if (e.target.dataset.action != "strongDelete") {
    return;
  }

  const taskLi = e.target.closest("li");
  const parentId = taskLi.id;

  const index = dltdTasks.findIndex((el) => el.id == parentId);
  dltdTasks.splice(index, 1);
  taskLi.remove();

  checkIfEmptyDltd();
  toLocalStorage("dltdTasks", dltdTasks);
}
