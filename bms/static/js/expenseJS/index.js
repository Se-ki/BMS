document.addEventListener("DOMContentLoaded", () => {
    const expense = document.getElementById('save-expense')
    const eDescription = document.getElementById('expense-description')
    const eAmount = document.getElementById('expense-amount')
    const expenseTBody = document.getElementById('expenses')
    const b_id = document.getElementById('b_id')
    const total_expense = document.getElementById('total-expense')
    const remain_budget = document.getElementById('remain-budget')
    const expenseButton = document.getElementById('expenseButton')
    const modalExpense = new bootstrap.Modal(document.getElementById('expenseModal'))
    const dataTable = new DataTable('#expensesTable')

    let getThatAmount = ''
    expense.addEventListener('click', async (e) => {
        e.preventDefault()
        if (parseFloat(eAmount.value) > parseFloat(getThatAmount)) {
            alert('The value is greater than the remaining budget!')
        } else {
            const data = {
                expense_dscrption: eDescription.value,
                expense_amnt: eAmount.value,
                b_id: b_id.value
            }
            jsonData = JSON.stringify(data)
            const response = await fetch('/add-expense/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: jsonData
            })
            const json = await response.json()
            eDescription.value = ""
            eAmount.value = ""
            modalExpense.hide()
            getExpenses()
        }
    })
    async function getExpenses() {
        const response = await fetch(
            '/get-expenses/?' +
            new URLSearchParams({
                b_id: b_id.value
            })
        )
        const json = await response.json()
        const expenses = json.expenses
        budget_amount = json.b_amount
        getThatAmount = budget_amount
        let table = ''
        let total = 0
        expenses.map((data) => {
            total += parseFloat(data.expense_amount)
            table += `<tr>                                                                                                                            <td>${data.description}</td>                                                         
                   <td>${data.expense_amount}</td>                                                      
                 </tr>`
        })
        expenseTBody.innerHTML = table
        total_expense.innerHTML = '₱' + total
        remain_budget.innerHTML = 'Remaining Budget: ' + budget_amount
        if (parseInt(budget_amount) <= 0) {
            expenseButton.disabled = true
        }
    }
    getExpenses()
})
