import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, onValue, push, ref, remove, update } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://shopping-list-a3393-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const shoppingListInDB = ref(database, "shoppingList");

const header = document.getElementById("header");
const inputFieldEl = document.getElementById("input-field");
const addButtonEl = document.getElementById("add-button");
const shoppingListEl = document.getElementById("shopping-list");

const addItemToList = () => {
  let inputValue = inputFieldEl.value;
  let item = {
    value: inputValue,
    selected: false,
  };

  if (inputValue) {
    push(shoppingListInDB, item);
	animateHeader('/assets/animated-cat.gif', 1000);

    clearInputFieldEl();
  }
};

const animateHeader = (path, msDuration) => {
    let newItemAnimation = document.createElement("img");
    newItemAnimation.className = "animate-header";
    newItemAnimation.src = path;

    header.appendChild(newItemAnimation);
	setTimeout(() => {
		header.removeChild(newItemAnimation)
	}, msDuration ? msDuration : 500);
}

addButtonEl.addEventListener("click", function () {
  addItemToList();
});

inputFieldEl.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    addItemToList();
  }
});

onValue(shoppingListInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    clearShoppingListEl();

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];

      appendItemToShoppingListEl(currentItem);
    }
    // const removeAllBtn = document.createElement("button");
    // removeAllBtn.id='remove-all'
    // shoppingListEl.insertAdjacentHTML('afterend', `<button id="remove-all" title="Remove all products from list">Remove all products</button>`);
  } else {
    shoppingListEl.innerHTML = `You don't have any product in your Shopping List`;
  }
});

function clearShoppingListEl() {
  shoppingListEl.innerHTML = "";
}

function clearInputFieldEl() {
  inputFieldEl.value = "";
}

function appendItemToShoppingListEl(item) {
  let itemID = item[0];
  let itemValue = item[1].value;
  let itemSelected = item[1].selected;

  let newEl = document.createElement("li");
  if (itemSelected) {
    newEl.className = "selected";
    newEl.title = "Click to deselect";
  } else {
    newEl.title = "Click to select";
  }

  let removeBtn = document.createElement("i");
  removeBtn.className = "btn-remove fas fa-trash";
  removeBtn.title = "Click to remove from list";

  newEl.textContent = itemValue;
  newEl.appendChild(removeBtn);

  newEl.addEventListener("click", function (e) {
    const updates = {};
    if (itemSelected) {
      updates[`shoppingList/${itemID}/selected/`] = false;	  
    } else {
      updates[`shoppingList/${itemID}/selected/`] = true;
    }	
	animateHeader('/assets/cart.gif');
    update(ref(database), updates);
  });

  removeBtn.addEventListener("click", function (e) {
    e.stopImmediatePropagation();
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`);

    remove(exactLocationOfItemInDB);
  });

  shoppingListEl.append(newEl);
}
