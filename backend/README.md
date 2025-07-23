# BACKEND

## Set up

### `.env` file

./backend/.env

```
SECRET_KEY=123456
DATABASE_URL=sqlite:///dev.db
```

### Virtual environment

Python 3.9.6 ('.vent':Pipenv)

Using `uv`

```
uv venv .venv
source .venv/bin/activate
```

### Install pipenv dependencies

```shell
# pipenv install && pipenv shell
uv pip install -r requirements.txt
```

## Usage

- Start Server

  ```
  pipenv run flask run
  ```

- Create database and seed (when there's no dev.db)

  ```
  pipenv run i
  ```

- Regenerate database

  ```
  pipenv run db
  ```

- Other quick commands

```
[scripts]

pipenv run + " "

d = "rm instance/dev.db"
m = "pipenv run flask db migrate"
u = "pipenv run flask db upgrade"
i = "sh -c 'pipenv run u && flask seed && flask run'"
db = "sh -c 'pipenv run d && pipenv run u && flask seed && flask run'"
```

## Setting up local `PostgreSQL` database

> Note: Instructions most likely for WSL users

1. Install PostgreSQL

   `sudo apt update`

   `sudo apt install postgresql postgresql-contrib`

1. Install Psycorpg2-Binary (-binary for local use)

1. This should be handled automatically by pipenv install reading pipfile.

   Manual setup (shouldn't be necessary):

   ```shell
   cd backend/
   pipenv shell    # Ensure you're in the venv
   pipenv install psycopg2-binary
   ```

1. Setup up PSQL User and DB

1. Log in to PSQL as the default 'postgres' user

   ```shell
   sudo -i -u postgres
   psql
   ```

   ```sql
   -- Create PSQL user (skip if have dedicated user already)
   CREATE USER username WITH PASSWORD password;
   -- Grant User permissions to create databases
   ALTER USER username CREATEDB;

   -- Create a new database
   CREATE DATABASE ask_geeves_dev OWNER username;
   -- Grant user database owner privleges (needed to access db via psql terminal)
   ALTER DATABASE ask_geeves_dev OWNER TO username;

   -- Exit psql
   \q
   -- Likely need to CTRL+D to get back out to base terminal agin.
   ```

1. Verify Database was created:

   ```shell
   psql -U username -d ask_geeves_dev
   ```

   Should see asked_geeves_dev=> in terminal

## Configure the Flask App for PSQL Database

### Most of this will be done already. Modifying the DATABASE_TYPE and POSTGRES_URL in .env should be the only step required.

```python
    # backend/.env
SECRET_KEY=84ae690353f3735f9f2aa1b5ffef0a01d967c909b9d0c796
    # We'll change this value between sqlite and postgres depending on what we're testing. For 99.9% of dev purpose, leave it as sqlite
DATABASE_TYPE=postgres
DATABASE_URL=sqlite:///dev.db
    # User username/password values from the user you just created
POSTGRES_URL=postgresql://username:password@localhost/ask_geeves_dev
```

```python
    # backend/config.py
import os


class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY")
    FLASK_ENV = os.environ.get("FLASK_ENV")
    SQLALCHEMY_TRACK_MODIFICATIONS = False



class DevConfig(Config):
    DATABASE_TYPE = os.getenv("DATABASE_TYPE", "sqlite")
    SQLALCHEMY_DATABASE_URI = (
        os.getenv("POSTGRES_URL")
        if DATABASE_TYPE == "postgres"
        else os.getenv("DATABASE_URL", "sqlite:///dev.db")
    )


    # ProdConfig won't be used until production deployment, and subject to change.
class ProdConfig(Config):
    SQLALCHEMY_DATABASE_URI = os.getenv("POSTGRES_URL")


config_dict = {"development": DevConfig, "production": ProdConfig}
```

```python
    # backend/app/__init__.py

# imports subject to change obviously. config_dict is the important one for this
import os
from flask import Flask
from .config import config_dict
from flask_login import LoginManager
from .models.db import db
from .models.user import User
from .routes import session, user, question, answer
from flask_migrate import Migrate
from .seeders.seed_funcs import seed_all, clear_all_data
from flask_wtf.csrf import CSRFProtect

app = Flask(__name__)
# Sets env based on FLASK_ENV, default='development'
env = os.getenv("FLASK_ENV", "development")
# Applies config based on env value, default='development'
config_class = config_dict.get(env, "development")
app.config.from_object(config_class)

db.init_app(app)
migrate = Migrate(app, db)

    # ...
```

## Create Initial Migrations

### Skip to upgrade if migrations were done previously with sqlite

`flask db init`

`flask db migrate -m 'initial migration'`

`flask db upgrade`

`flask seed` Seeds psql db with seeder data (considering moving this step to be included in previous command)

## Verify Database Connection

### Log in to PSQL Database via user we created earlier

`psql -U username -d ask_geeves_dev`

```sql
\dt -- Should see tables
SELECT * FROM comments -- Should see all comments if seeding & privilege grant was successful
```
