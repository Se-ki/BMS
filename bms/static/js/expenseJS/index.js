$(function () {
    let getThatAmount = ''

    async function expenses() {
        try {
            const response = await axios.get(`/get-expenses/?b_id=${$("#b_id").val()}`);
            let expenses = response.data.expenses
            let budgetAmount = response.data.b_amount
            let totalExpense = 0
            getThatAmount = budgetAmount
            expenses.map(expense => totalExpense += parseInt(expense.expense_amount))
            $("#total-expense").html('Total Expense: ' + totalExpense)
            $("#remain-budget").html('Remaining Budget: ' + budgetAmount)
            if (parseInt(budgetAmount) <= 0) {
                $("#expenseButton").prop("disabled", true)
            }
            $("#expensesTable").DataTable({
                data: expenses,
                destroy: true, //to able to reinitialize
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
                    },
                ],
            })
        } catch (error) {
            console.error(error);
        }
    }

    $("#save-expense").on('click', async (e) => {
        e.preventDefault()
        if (parseFloat($('#expense-amount').val()) > parseFloat(getThatAmount)) {
            alert('The value is greater than the remaining budget!')
        } else {
            try {
                const jsonData = {
                    expenseDescription: $('#expense-description').val(),
                    expenseAmount: $('#expense-amount').val(),
                    budgetId: $("#b_id").val()
                }
                const response = await axios.post("/add-expense/", jsonData)
                console.log(response)
                $('#expense-description').val("")
                $('#expense-amount').val("")
                $("#expenseModal").modal("hide")
                expenses()
            } catch (error) {
                console.error(error)
            }
        }
    })

    // initialize to see expenses data
    expenses()
})
