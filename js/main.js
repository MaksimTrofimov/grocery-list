document.querySelector('form').addEventListener('submit', handle);

let editItem = false;
let editItemID = "";
let editItemVal = "";

function handle(event) {
    event.preventDefault();
    let item = document.getElementById('grocery__input').value;
    document.getElementById('grocery__input').value = '';

    if (item.trim()) {
        addItem(item);
    }
}

function addItem(item) {
    let list = localStorage.getItem('grocery');
    if (list == null) {
        let obj = {
            [generateId()]: item
        };
        localStorage.setItem('grocery', JSON.stringify(obj));
        showAlert('Added');
    } else if (editItem) {
        let obj = JSON.parse(list);
        obj[editItemID] = item;
        localStorage.setItem('grocery', JSON.stringify(obj));
        editItemID = "";
        editItemVal = "";
        editItem = false;
        showAlert('Changed');
    } else {
        let obj = JSON.parse(list);
        obj[generateId()] = item;
        localStorage.setItem('grocery', JSON.stringify(obj));
        showAlert('Added');
    }
    renderList();
}

function generateId() {
    return Date.now().toString();
}

function renderList() {
    const listContainer = document.getElementById('groceryList');
    const stored = localStorage.getItem('grocery');
    if (!stored) {
        listContainer.innerHTML = '<p>No items added yet.</p>';
        return;
    }
    const list = JSON.parse(stored);

    const keys = Object.keys(list);
    let html = '';

    for (const id of keys) {
        const item = list[id];
        html += `
                <div data-id="${id}" class="grocery__item">
                    <span class="grocery__text">${item}</span>
                    <div class="grocery__buttons">
                        <button class="grocery__edit-btn" title="Edit">
                            <i class="fas fa-pen"></i>
                        </button>
                        <button class="grocery__delete-btn" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>`;
    }

    listContainer.innerHTML = html;
}

renderList();

document.getElementById('groceryList').addEventListener('click', function(e) {
    const button = e.target.closest('button');
    if (button) {
        const item = button.closest('.grocery__item');
        editItemID = item.dataset.id;
        if (button.classList.contains('grocery__edit-btn')) {
            edit(editItemID);
        } else if (button.classList.contains('grocery__delete-btn')) {
            deleteItem(editItemID);
        }
    }
});

document.querySelector('.grocery__clear').addEventListener('click', clearAll);

function edit(editItemID) {
    let list = localStorage.getItem('grocery');
    let obj = JSON.parse(list);
    editItemVal = obj[editItemID];
    document.getElementById('grocery__input').value = editItemVal;
    editItem = true;
}

function deleteItem(id) {
    let list = localStorage.getItem('grocery');
    let obj = JSON.parse(list);
    delete obj[id];
    localStorage.setItem('grocery', JSON.stringify(obj));
    renderList();
    showAlert('Deleted');
}

function clearAll() {
    localStorage.removeItem('grocery');
    renderList();
    showAlert('Clear All');
}

function showAlert(message, color = 'green') {
    const alert = document.querySelector('.alert');
    alert.textContent = message;
    alert.style.color = color;
    alert.style.textAlign = 'center';

    setTimeout(() => {
        alert.textContent = '';
    }, 2000);
}