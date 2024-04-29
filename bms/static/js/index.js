axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.xsrfCookieName = 'csrftoken';

if ($("#get-budgets")[0]) {

    let getThatId = "";

    async function getBudgetData() {

        const response = await axios.get('get-budgets/');

        const budgets = await response.data.budgets;

        var list = '';

        budgets.map(budget => {
            list += `<article class="media content-section">                                                                                                  
                <div class="media-body"> 
                  <div class="article-metadata"> 
                    <a class="mr-2 text-capitalize" href="expenses/${budget.id}">${budget.budget_name}</a>
                    <small class='text-muted'>${formattedDate(budget.date_posted)}</small>
                </div>
                  <h2><a class='article-title' href='expenses/${budget.id}'>${budget.budget_amount}</a></h2>
                </div>
                <div class='article-actions'>
                  <a href='' class='edit-link' data-getId='${budget.id}' data-bs-toggle='modal' data-bs-target='#editBudget'>Edit</a>
                  <a href='#' id="deleteBudget" data-getId='${budget.id}' class='delete-link'>Delete</a>
                </div>
            </article>`;
        });

        if (budgets.length > 0) {

            $("#get-budgets").html(list);

        } else {

            $("#get-budgets").html("<h1>There is no budget added, click budget button to add budget!</h1>");

        }
    }

    getBudgetData();

    $(document).on('click', async (e) => {

        if ($(e.target).hasClass('edit-link')) {

            e.preventDefault();

            const budgetId = $(e.target).attr("data-getId");

            getThatId = budgetId;

            try {

                const response = await axios.get(`/show-edit-budget/?b_id=${budgetId}`);

                const budget = response.data.budget;

                let editForm = `<div class="mb-3">
                <label class="text-light" for="description">Edit Description</label>
                <input type="text" placeholder="Enter Description" value='${budget.budget_name}' class='form-control' id='edit-description' />
              </div>
              <div class="mb-3">
                <label class="text-light" for="budget">Edit Amount</label>
                <input type="number" value='${budget.budget_amount}' placeholder='Enter Budget Amount' class='form-control' id='edit-amount' />
              </div>`;

                $("#edit-budget-form").html(editForm);

            } catch (error) {

                console.error(error);

            }
        } else if ($(e.target).hasClass("delete-link")) {

            e.preventDefault();

            let b_id = $(e.target).attr("data-getId");

            const response = await axios.post(`/delete-budget/`, { bId: b_id });

            getBudgetData();
        }
    });

    $("#add-budget").on("click", async (e) => {

        e.preventDefault();

        try {
            const jsonData = {
                description: $('#description').val(),
                budget: $('#budget').val(),
            }

            const response = await axios.post("add-budget/", jsonData);

            getBudgetData();

            $("#description").val("");

            $("#budget").val("");

            $("#addBudget").modal("hide");

        } catch (error) {

            console.error(error);

        }
    });

    $("#edit-budget").on("click", async (e) => {

        e.preventDefault();

        const jsonData = {
            editDescription: $("#edit-description").val(),
            editAmount: $("#edit-amount").val(),
            bId: getThatId,
        }

        try {

            const response = await axios.post(`/update-budget/`, jsonData);

            $("#edit-description").val("");

            $("#edit-amount").val("");

            $("#editBudget").modal("hide");

            getBudgetData();

        } catch (error) {

            console.error(error);

        }
    })

    function formattedDate(date) {

        var today = new Date(date)

        return today.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
}


if ($("#expensesTable")[0]) {

    let getThatAmount = '';

    async function expenses() {

        try {

            let bId = $("#b_id").val();

            const response = await axios.get(`/get-expenses/?b_id=${bId}`);

            let expenses = response.data.expenses;

            let budgetAmount = response.data.b_amount;

            let totalExpense = 0;

            getThatAmount = budgetAmount;

            expenses.map(expense => totalExpense += parseInt(expense.expense_amount));

            $("#total-expense").html('Total Expense: ' + totalExpense);

            $("#remain-budget").html('Remaining Budget: ' + budgetAmount);

            if (parseInt(budgetAmount) <= 0) {

                $("#expenseButton").prop("disabled", true);

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
            });

        } catch (error) {

            console.error(error);

        }
    }

    $("#save-expense").on('click', async (e) => {

        e.preventDefault();

        if (parseFloat($('#expense-amount').val()) > parseFloat(getThatAmount)) {

            alert('The value is greater than the remaining budget!');

        } else {

            try {

                const jsonData = {
                    expenseDescription: $('#expense-description').val(),
                    expenseAmount: $('#expense-amount').val(),
                    budgetId: $("#b_id").val()
                }

                const response = await axios.post("/add-expense/", jsonData);

                $('#expense-description').val("");

                $('#expense-amount').val("");

                $("#expenseModal").modal("hide");

                expenses()

            } catch (error) {

                console.error(error);

            }

        }
    })

    // initialize to see expenses data
    expenses()
}