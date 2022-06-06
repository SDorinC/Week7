let arr = [];
let idCounter = 0;
let tempID = -1;
let submitBtn = document.getElementById("submit");
let inputField = document.getElementById("newToDo");
let list = document.getElementById("list");
let popUp = document.getElementById("popUp");

document.addEventListener("DOMContentLoaded", function () {
    fetch('https://jsonplaceholder.typicode.com/todos')
        .then((response) => response.json())
        .then((json) => {
            for (let i = 0; i < json.length; i++) {
                let obj = {
                    userID: json[i].userId,
                    id: json[i].id,
                    title: json[i].title,
                    completed: json[i].completed,
                }
                arr.push(obj);
            }
            displayItems();
            idCounter = arr[arr.length - 1].id;
        });
});

submitBtn.addEventListener("click", function onClick() {
    addItem();
    displayItems();
    inputField.value = "";
})

document.addEventListener("keypress", function onClick(e) {
    if (e.key === 'Enter') {
        addItem();
        displayItems();
        inputField.value = "";
    }
})

function addItem() {
    let item = {
        userID: setUserId(),
        id: idCounter + 1,
        title: inputField.value,
        completed: false
    }
    if (item.title === "") {
        return;
    }
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].id === tempID) {
            arr[i].title = inputField.value;
            updateServer(arr[i].id, arr[i].title, arr[i].completed);
            popUpMessage("Item was successfully edited");
            tempID = -1;
            return;
        }
    }
    arr.push(item);
    fetch('https://jsonplaceholder.typicode.com/posts/', {
        method: 'POST',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(
            {
                "userId": item.userID,
                "id": item.id,
                "title": item.title,
                "completed": item.completed
            }
        )
    }).then(res => console.log(res));
    idCounter++;
    popUpMessage("Item was successfully added");
}

function displayItems() {
    list.innerHTML = "";
    arr.forEach((item) => {
        let li = document.createElement("li");
        li.innerText = item.title;
        li.id = item.id;
        li.addEventListener("click", function () {
            if (item.completed === false) {
                li.style.textDecorationLine = "line-through";
                item.completed = true;
                updateServer(item.id, item.title, item.completed);
            } else {
                li.style.textDecorationLine = "none";
                item.completed = false;
                updateServer(item.id, item.title, item.completed);
            }
        })
        if (item.completed === true) {
            li.style.textDecorationLine = "line-through";
        }
        editButton(li);
        delButton(li);
        list.appendChild(li);
    });
}

function delButton(parent) {
    let buttonElem = parent.appendChild(document.createElement("button"));
    buttonElem.classList.add("delete");
    buttonElem.innerHTML = '<i class = "fa-solid fa-trash"></i>';
    buttonElem.onclick = function (e) {
        e.stopPropagation();
        for (let i = 0; i < arr.length; i++) {
            if (this.parentElement.id == arr[i].id) {
                let tempValue = arr[i].id;
                arr.splice(i, 1);
                fetch('https://jsonplaceholder.typicode.com/posts/' + tempValue, {
                    method: 'DELETE',
                    headers: {"Content-Type": "application/json"}
                }).then(res => console.log(res));
                displayItems();
                popUpMessage("Item was successfully deleted");
            }
        }
    }
}

function editButton(parent) {
    let buttonElem = parent.appendChild(document.createElement("button"));
    buttonElem.classList.add("edit");
    buttonElem.innerHTML = '<i class = "fa-solid fa-pen-to-square"></i>';
    buttonElem.onclick = function (e) {
        e.stopPropagation();
        for (let i = 0; i < arr.length; i++) {
            if (this.parentElement.id == arr[i].id) {
                inputField.value = arr[i].title;
                tempID = arr[i].id;
            }
        }
    }
}

function popUpMessage(message) {
    popUp.innerHTML = message;
    popUp.className = "show";
    setTimeout(function () {
        popUp.className = popUp.className.replace("show", "");
    }, 2000);
}

function setUserId() {
    let userId = arr[arr.length - 1].userID;
    if ((userId * 20) === arr[arr.length - 1].id) {
        return ++userId;
    }
    return userId;
}

function updateServer(id, title, completed) {
    fetch('https://jsonplaceholder.typicode.com/posts/' + id, {
        method: 'PUT',
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(
            {
                "title": title,
                "completed": completed
            }
        )
    }).then(res => console.log(res));
}