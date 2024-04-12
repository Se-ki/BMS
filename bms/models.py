from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User

# Create your models here.

class Budget(models.Model):
    budget_name = models.CharField(max_length=100)
    budget_amount = models.DecimalField(max_digits=10, decimal_places=2)
    date_posted = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    def __str__(self):
        return self.budget_name
    
class Expense(models.Model):
    description = models.CharField(max_length=100)
    expense_amount = models.DecimalField(max_digits=10, decimal_places=2)
    date_posted = models.DateTimeField(default=timezone.now)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    budget = models.ForeignKey(Budget, on_delete=models.CASCADE)
