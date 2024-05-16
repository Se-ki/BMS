Step 1: Make sure you already install python, pip and xampp in your local device

Step 2: Make sure that the folder is not doubled or if its doubled make sure the path is for example C:/User/USER/Downloads/budget_monitoring_system/budget_monitoring_system (because after you extract the folder the folder will doubled)

Step 3: Install Virtual Environment on folder budget_monitoring_system using the command python -m venv .venv

Step 4: Activate the virtual environment to activate type this command .venv/Scripts/activate

Step 5: Install all the dependencies. To install all dependencies type this command, pip install -r requirements.txt

Step 6: Open your XAMPP click start Apache and MySQL

Step 7: Type this command, python manage.py migrate

Step 8: Type this command, python manage.py runserver
