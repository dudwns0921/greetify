FROM python:3.12-slim

ENV POETRY_VERSION=2.1.3

RUN pip install "poetry==$POETRY_VERSION"

WORKDIR /app

COPY pyproject.toml poetry.lock ./
COPY app ./app
RUN poetry config virtualenvs.create false \
 && poetry install --no-interaction --no-ansi

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]