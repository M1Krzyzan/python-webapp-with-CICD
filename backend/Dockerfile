# Define Global ARG once (for all stages)
ARG WORKDIR="/app"

# ---- Builder Stage ----
FROM python:3.12.7-slim AS builder

# Install system dependencies required for Poetry
RUN apt-get update && apt-get install -y --no-install-recommends curl && rm -rf /var/lib/apt/lists/*

# Install Poetry
ENV POETRY_VERSION=1.8.4
RUN pip install --no-cache-dir "poetry==$POETRY_VERSION"

# Set working directory
ARG WORKDIR
WORKDIR ${WORKDIR}

# Copy only dependency files for caching efficiency
COPY pyproject.toml poetry.lock ./

# Install dependencies (without virtual environments)
RUN poetry config virtualenvs.create false \
    && poetry install --no-root --without dev

# Copy the rest of the application files (AFTER dependencies are installed)
COPY . .

# Build the wheel package
RUN poetry build -f wheel

# ---- Runner Stage ----
FROM python:3.12.7-slim AS runner

# Set workdir
ARG WORKDIR
WORKDIR ${WORKDIR}

# Copy the built wheel file from the builder
COPY --from=builder /app/dist/*.whl ./

# Install the wheel and clean up
RUN pip install --no-cache-dir ./*.whl && rm -rf ./*.whl

# Expose the FastAPI port
EXPOSE 8002

# Run FastAPI with uvicorn
CMD ["uvicorn", "infrastructure.api.main:app", "--host", "0.0.0.0", \
    "--port", "8002", "--log-level", "debug"]
