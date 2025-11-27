FROM python:3.11-slim

WORKDIR /app

# Базовые зависимости
RUN pip install --no-cache-dir kafka-python faker

COPY producer.py .

ENV KAFKA_BOOTSTRAP_SERVERS=kafka:9092
ENV KAFKA_TOPIC=transactions.raw

CMD ["python", "producer.py"]
