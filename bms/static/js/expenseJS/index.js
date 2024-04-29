$(document).ready(() => {
    const eDescription = document.getElementById('expense-description')
    const eAmount = document.getElementById('expense-amount')
    const b_id = document.getElementById('b_id')
    const expenseButton = document.getElementById('expenseButton')

    let getThatAmount = ''

    async function expenses() {
        try {
            const response = await axios.get(`/get-expenses/?b_id=${b_id.value}`);
            let expenses = response.data.expenses
            let budgetAmount = response.data.b_amount
            getThatAmount = budgetAmount

            let total = 0
            $("#remain-budget").html('Remaining Budget: ' + budgetAmount)
            if (parseInt(budgetAmount) <= 0) {
                expenseButton.disabled = true
            }
            $("#expensesTable").DataTable({
                data: expenses,
                // destroy: true, //to able to reinitialize
                responsive: true,
                columns: [
                    {
                        data: null,
                        render: function (data, type, full, meta) {
                            // Use meta.row to get the row index, and add 1 to start from 1
                            return meta.row + 1;
                        },
                        name: 'id',
                    },
                    {
                        data: "description",
                    },
                    {
                        data: "expense_amount",
                        render: function (data, type, row) {
                            total += parseFloat(data)
                            console.log(row)
                            return data
                        },
                    },
                ],
            })
            $("#total-expense").html('Total Expense: ' + total)
        } catch (error) {
            console.error(error);
        }
    }

    $("#save-expense").on('click', async (e) => {
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
            $("#expenseModal").modal("hide")
            expenses()
        }
    })
    expenses()
})
