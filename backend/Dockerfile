# Global ARGm available to all stages
ARG WORKDIR="/app"

FROM python:3.12.7-slim AS builder

# Install Poetry (adjust version as needed)
ENV POETRY_VERSION=1.8.4
RUN pip install --no-cache-dir "poetry==$POETRY_VERSION"

# Set workdir
ARG WORKDIR
WORKDIR ${WORKDIR}
# Copy poetry files for dependency install
COPY pyproject.toml poetry.lock /app/

# Install dependencies
# --no-root: do not install the current package itself as a library
# --without dev: skip dev dependencies
RUN poetry config virtualenvs.create false \
    && poetry install --no-root --without dev

COPY . .

RUN poetry build -f wheel

FROM python:3.12.7-slim AS runner

# Set workdir
ARG WORKDIR
WORKDIR ${WORKDIR}

# Copy the wheel file from the builder
COPY --from=builder /app/dist/*.whl ./

# Install the wheel in the runner container
RUN pip install --no-cache-dir ./*.whl

# Expose the port FastAPI will listen on
EXPOSE 8002

# Run FastAPI with uvicorn, referencing your main app
CMD ["uvicorn", "infrastructure.api.main:app", "--host", "0.0.0.0", \
    "--port", "8002", "--log-level", "debug"]
