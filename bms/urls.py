from django.urls import path
from . import views
from django.contrib.auth import views as auth_views


urlpatterns = [
    path("register/", views.register, name="register"),
    path("login/", auth_views.LoginView.as_view(template_name="auth/login.html"), name="login"),
    path('logout/', auth_views.LogoutView.as_view(), name="logout"),
    #  path('logout/', auth_views.LogoutView.as_view(template_name="users/logout.html"), name="logout"),
    
    path("", views.dashboard, name="dashboard"),
    path("expenses/<expns_id>", views.expenses, name="expenses"),
    path("add-budget/", views.addBudget),
    path("add-expense/", views.addExpenses),
    
    # get data through ajax
    path("get-expenses/", views.getExpensesData),
    path("get-budgets/", views.getBudgetData),
    path("show-edit-budget/", views.showBudget),
    path("update-budget/", views.updateBudget),
    path("delete-budget/", views.deleteBudget),
]