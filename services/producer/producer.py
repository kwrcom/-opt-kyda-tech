import json
import os
import time
import uuid
import random

from kafka import KafkaProducer
from faker import Faker

BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")
TOPIC = os.getenv("KAFKA_TOPIC", "transactions.raw")

fake = Faker()


def create_producer():
    while True:
        try:
            print(f"[PRODUCER] Connecting to Kafka at {BOOTSTRAP_SERVERS}...")
            producer = KafkaProducer(
                bootstrap_servers=BOOTSTRAP_SERVERS,
                value_serializer=lambda v: json.dumps(v).encode("utf-8"),
            )
            print("[PRODUCER] Connected.")
            return producer
        except Exception as e:
            print(f"[PRODUCER] Kafka not ready: {e}. Retry in 5s...")
            time.sleep(5)


def generate_transaction():
    return {
        "transaction_id": str(uuid.uuid4()),
        "user_id": fake.random_int(min=1, max=100000),
        "amount": round(random.uniform(1.0, 1000.0), 2),
        "currency": "USD",
        "timestamp": fake.iso8601(),
    }


def main():
    producer = create_producer()

    while True:
        msg = generate_transaction()
        try:
            producer.send(TOPIC, msg)
            producer.flush()
            print(f"[PRODUCER] Sent: {msg}")
        except Exception as e:
            print(f"[PRODUCER] Error sending message: {e}")
            # пробуем пересоздать продюсера
            producer = create_producer()

        time.sleep(2)


if __name__ == "__main__":
    main()
