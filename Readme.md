## Project Name
Blog App
##

### Description
- Blog app created using django and react framework.

##

### Table of Contents
- Installation
- Setting Up React
- Setting Up Django

##
### Installation
To run this project locally, follow these steps:

Clone the repository: git clone https://github.com/bipin1050/blog-app.git .
Navigate to the project directory: cd blog-app

### Setting Up React
Navigate to the frontend directory: ``cd frontend`` \
Install dependencies: ``npm install`` \
Start the development server: ``npm start`` 

### Setting Up Django
Navigate to the backend directory: ``cd backend``\
Create and activate a virtual environment (recommended):``python -m venv venv``
Activate virtual environment ``. venv/bin/activate``    
On Windows, use ``venv\Scripts\activate``\
Install Django and other dependencies: ``pip install -r requirements.txt``\
Create Database:\
Run migrations: ``python manage.py migrate``\
Create a superuser (if needed): ``python manage.py createsuperuser``\
Start the Django development server: ``python manage.py runserver``

##
To connect to the database and other configurations, you need to have .env file configured in your project.

Create file name ``.env`` in ``blog-app/backend`` directory and save some config. Here is a sample example

```
DB_NAME= "blog_app"
DB_USER = "postgres"
DB_PASSWORD = "password"
DB_HOST = "localhost"
DB_PORT = 5432

DEFAULT_FROM_EMAIL = "noreply@blog.com"
EMAIL_USE_SSL = False
EMAIL_USE_TLS = True
EMAIL_TIMEOUT = 25
EMAIL_HOST = 'sandbox.smtp.mailtrap.io'   # using mail trap
EMAIL_HOST_USER = 'email-user'
EMAIL_HOST_PASSWORD = 'password1234'
EMAIL_PORT = '2525'

ALLOWED_HOSTS=localhost:3000, 127.0.0.1:3000
```
