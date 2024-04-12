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
    return render(request, "show_expenses.html", {"b_id" : expns_id})

@login_required
def showBudget(request):
    get_id = list(request.GET.values())
    b_id = get_id[0] 
    budget = Budget.objects.filter(id=b_id).values().first()
    return JsonResponse({"budget": budget})

@login_required
@csrf_exempt
def updateBudget(request):
    json_data  = list(request.POST.keys())[0]
    data_dict = json.loads(json_data)
    description = data_dict.get("edit_description")
    amount = data_dict.get("edit_amount")
    b_id = data_dict.get("b_id")
    budget = Budget.objects.filter(id=b_id).get()
    budget.budget_name = description
    budget.budget_amount = amount
    budget.save()
    return JsonResponse({"success": "Saved the edited budget."})

@login_required
def getExpensesData(request):
    get_id = list(request.GET.values())
    b_id = get_id[0] 
    expenses = Expense.objects.filter(budget_id=b_id)
    budget = Budget.objects.filter(id=b_id, user_id=request.user.id).first()
    expenses_list = list(expenses.values())
    return JsonResponse({"expenses": expenses_list, "b_amount": budget.budget_amount})

@login_required
def getBudgetData(request):
    budget = Budget.objects.filter(user_id=request.user.id).order_by("-id").values()
    budget_list = list(budget)
    return JsonResponse({"budgets":budget_list})

@login_required
@csrf_exempt
def deleteBudget(request):
    get_id = list(request.GET.values())
    b_id = get_id[0]
    budget = Budget.objects.get(id=b_id)
    budget.delete()
    return JsonResponse({"message": f"You delete {budget}" })

@login_required
@csrf_exempt
def addBudget(request):
    json_data  = list(request.POST.keys())[0]
    data_dict = json.loads(json_data)
    description = data_dict.get('description')
    budget = data_dict.get('budget')
    Budget(budget_name=description, budget_amount=budget, user_id=request.user.id).save()
    return JsonResponse({"message": "Budget Stored"})

@login_required
@csrf_exempt
def addExpenses(request):
    json_data = list(request.POST.keys())[0]
    data_dict = json.loads(json_data)
    expense_description = data_dict.get("expense_dscrption")
    expense_amount = data_dict.get("expense_amnt")
    budget_id = data_dict.get("b_id")
    budget = Budget.objects.filter(id=budget_id).get()
    remaining_budget = float(budget.budget_amount) - float(expense_amount)
    addExpense = Expense(description=expense_description, expense_amount=expense_amount, user=request.user, budget=budget)
    budget.budget_amount = remaining_budget
    addExpense.save()
    budget.save()
    return JsonResponse({"message": "added and updated"})

def logout(request):
    logout(request)
    return HttpResponseRedirect("/")