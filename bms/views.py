from django.shortcuts import render, redirect, HttpResponseRedirect
from django.http import JsonResponse, QueryDict
from django.views.decorators.csrf import csrf_exempt
from .models import Budget, Expense, User
import json
from .forms import UserRegistrationForm
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
# Create your views here.

def register(request):
    if request.method == "POST":
        form = UserRegistrationForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get("username")    
            messages.success(request, f"Account created for {username}!")
            return redirect("login")
    else:
        form = UserRegistrationForm()    

    return render(request, "auth/register.html", {"form": form})

@login_required
def dashboard(request):
    return render(request, "dashboard.html")
    
@login_required
def expenses(request, expns_id):
    return render(request, "show_expenses.html", {"bId" : expns_id})

@login_required
def showBudget(request):
    b_id = list(request.GET.values())[0]
    budget = Budget.objects.filter(id=b_id).values().first()
    return JsonResponse({"budget": budget})

@login_required
def updateBudget(request):
    data = json.load(request)
    description = data.get("editDescription")
    amount = data.get("editAmount")
    b_id = data.get("bId")
    budget = Budget.objects.filter(id=b_id).get()
    budget.budget_name = description
    budget.budget_amount = amount
    budget.save()
    return JsonResponse({"success": "Saved the edited budget."})

@login_required
def getExpensesData(request):
    b_id = request.GET.get("b_id") 
    budget = Budget.objects.filter(id=b_id, user_id=request.user.id).first()
    expenses = list(Expense.objects.filter(budget_id=b_id).values())
    return JsonResponse({"expenses": expenses, "b_amount": budget.budget_amount})

@login_required
def getBudgetData(request):
    budget = list(Budget.objects.filter(user_id=request.user.id).order_by("-id").values())
    return JsonResponse({"budgets":budget})

@login_required
def deleteBudget(request):
    data = json.load(request)
    b_id = data.get("bId")
    budget = Budget.objects.get(id=b_id)
    budget.delete()
    return JsonResponse({"message": f"You delete" })

@login_required
def addBudget(request):
    data = json.load(request)
    description = data.get('description')
    budget = data.get('budget')
    Budget(budget_name=description, budget_amount=budget, user_id=request.user.id).save()
    return JsonResponse({"message": "Budget Stored"})

@login_required
def addExpenses(request):
    data = json.load(request)
    e_description = data.get("expenseDescription")
    e_amount = data.get("expenseAmount")
    b_id = data.get("budgetId")
    budget = Budget.objects.filter(id=b_id).get()
    remaining_budget = float(budget.budget_amount) - float(e_amount)
    addExpense = Expense(description=e_description, expense_amount=e_amount, user=request.user, budget=budget)
    budget.budget_amount = remaining_budget
    addExpense.save()
    budget.save()
    return JsonResponse({"message": "added and updated"})

def logout(request):
    logout(request)
    return HttpResponseRedirect("/")