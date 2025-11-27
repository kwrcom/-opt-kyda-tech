FROM python:3.11-slim

WORKDIR /app

RUN pip install --no-cache-dir kafka-python

COPY consumer.py .

ENV KAFKA_BOOTSTRAP_SERVERS=kafka:9092
ENV KAFKA_TOPIC=transactions.raw
ENV KAFKA_GROUP_ID=test-consumer-group

CMD ["python", "consumer.py"]
