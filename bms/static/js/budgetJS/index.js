const addBudget = document.getElementById('add-budget')
const description = document.getElementById('description')
const budget = document.getElementById('budget')
const cmt = document.querySelector('input[name=csrfmiddlewaretoken]')
const editForm = document.getElementById('edit-budget-form')
const editButton = document.getElementById('edit-budget')
const deleteBudget = document.getElementById('deleteBudget')
const modalAddBudget = new bootstrap.Modal(document.getElementById('addBudget'))
const modalEditBudget = new bootstrap.Modal(document.getElementById('editBudget'))

getBudgetData()

if (addBudget) {
    addBudget.addEventListener('click', async (e) => {
        e.preventDefault()
        const data = {
            description: description.value,
            budget: budget.value
        }
        const jsonData = JSON.stringify(data)
        const response = await fetch('add-budget/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: jsonData
        })
        const json = await response.json()

        getBudgetData()
        description.value = ""
        budget.value = ""
        modalAddBudget.hide()
    })
}
const view = document.getElementById('get-budgets')
async function getBudgetData() {
    const response = await fetch('get-budgets/', {
        method: 'GET'
    })
    const json = await response.json()
    const budgets = json.budgets
    var str = ''
    budgets.map((data) => {
        str += `<article class="media content-section">                                                                                                  
                <div class="media-body"> 
                  <div class="article-metadata"> 
                    <a class="mr-2 text-capitalize" href="expenses/${data.id}">${data.budget_name}</a>
                    <small class='text-muted'>${formattedDate(data.date_posted)}</small>
                </div>
                  <h2><a class='article-title' href='expenses/${data.id}'>${data.budget_amount}</a></h2>
                </div>
                <div class='article-actions'>
                  <a href='' class='edit-link' data-getId='${data.id}' data-bs-toggle='modal' data-bs-target='#editBudget'>Edit</a>
                  <a href='#' id="deleteBudget" data-getId='${data.id}' class='delete-link'>Delete</a>
                </div>
            </article>`
    })
    let budgetCount = budgets.length
    if (budgetCount > 0) {
        view.innerHTML = str
    } else {
        view.innerHTML = '<h1>There is no budget added, click budget button to add budget!</h1>'
    }
}

document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('click', async (event) => {
        if (event.target.classList.contains('edit-link')) {
            event.preventDefault();
            const budgetId = event.target.getAttribute('data-getId');
            console.log(`Edit clicked for budget ID ${budgetId}`);
            getIdOfBudget(budgetId)
            const response = await fetch("show-edit-budget/?" +
                new URLSearchParams({
                    b_id: budgetId
                }))
            const json = await response.json()
            const budget = json.budget

            editForm.innerHTML = `<div class="mb-3">
        <label class="text-light" for="description">Edit Description</label>
        <input type="text" placeholder="Enter Description" value='${budget.budget_name}' class='form-control' id='edit-description' />
      </div>
      <div class="mb-3">
        <label class="text-light" for="budget">Edit Amount</label>
        <input type="number" value='${budget.budget_amount}' placeholder='Enter Budget Amount' class='form-control' id='edit-amount' />
      </div>`
        }
    });
});

let getThatId = ""
function getIdOfBudget(id) {
    getThatId = id
}

if (editButton) {
    editButton.addEventListener("click", async (e) => {
        e.preventDefault()
        const editDescription = document.getElementById("edit-description")
        const editAmount = document.getElementById("edit-amount")
        const data = {
            edit_description: editDescription.value,
            edit_amount: editAmount.value,
            b_id: getThatId,
        }
        const jsonData = JSON.stringify(data)
        const response = await fetch("update-budget/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: jsonData,
        })
        const json = await response.json()
        editDescription.value = ""
        editAmount.value = ""
        modalEditBudget.hide()
        getBudgetData()
    })
}

document.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-link")) {
        e.preventDefault()
        let b_id = e.target.getAttribute("data-getId")
        const response = await fetch("delete-budget/?" + new URLSearchParams({
            b_id: b_id
        }))
        const json = await response.json()
        getBudgetData()
        console.log(json)
    }
})

function formattedDate(date) {
    var today = new Date(date)
    return today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}
