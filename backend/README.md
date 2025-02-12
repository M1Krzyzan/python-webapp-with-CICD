# backend

## Installation
1. Install [poetry](https://python-poetry.org/docs/#installation).
2. Run `poetry install` to install the dependencies
3. You will need the following configuration files:
    - *.env* - file with project settings and other credentials. For convenience, you can run `cp .env.example .env` to utilize the provided example.

### Development
1. Run `pre-commit install` to install the [pre-commit](https://pre-commit.com/) hooks.

### Testing
Tests are divided into unit and integration. Use `pytest` to run tests both test types, `pytest tests/test_unit` to run
only unit tests and `pytest tests/test_integration` in order to run integration tests. For the integration tests also
starting the database is required - execute `./scripts/initdb.sh` to do so.


## Running
1. Execute `cd backend`
2. Execute `fastapi dev infrastructure/api/main.py` to start the server.