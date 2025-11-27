import os
import json
import time
import uuid
import random
from datetime import datetime
from faker import Faker
from kafka import KafkaProducer
from prometheus_client import Counter, Histogram, start_http_server

fake = Faker()

# ===========================
# Configuration
# ===========================
KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")
TPS = float(os.getenv("TRANSACTIONS_PER_SECOND", 5))
FRAUD_RATIO = float(os.getenv("FRAUD_RATIO", 0.05))
TOPIC_NAME = "transactions"

# ===========================
# Prometheus Metrics
# ===========================
TRANSACTION_COUNTER = Counter("producer_transactions_total", "Total transactions produced")
FRAUD_COUNTER = Counter("producer_fraud_transactions_total", "Fraud transactions produced")
AMOUNT_HISTOGRAM = Histogram("producer_transaction_amount", "Transaction amount distribution")

start_http_server(8000)

# ===========================
# Producer
# ===========================
producer = KafkaProducer(
    bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
    value_serializer=lambda v: json.dumps(v).encode("utf-8")
)

merchant_categories = {
    "electronics": (50, 400),
    "grocery": (5, 80),
    "fashion": (20, 300),
    "restaurants": (10, 120),
    "travel": (100, 1500),
}

transaction_types = ["online", "pos", "atm"]

countries = ["US", "UK", "DE", "FR", "KZ", "CN", "AU"]

# ===========================
# Fraud Generation Logic
# ===========================
def generate_normal_transaction(user_id):
    category = random.choice(list(merchant_categories.keys()))
    min_amt, max_amt = merchant_categories[category]
    amount = round(random.uniform(min_amt, max_amt), 2)

    return {
        "transaction_id": str(uuid.uuid4()),
        "user_id": user_id,
        "amount": amount,
        "currency": "USD",
        "merchant_id": str(uuid.uuid4()),
        "merchant_category": category,
        "transaction_type": random.choice(transaction_types),
        "timestamp": datetime.utcnow().isoformat(),
        "location": {
            "country": random.choice(countries[:3]),  # чаще стабильные локации
            "city": fake.city(),
        },
        "device_id": str(uuid.uuid4()),
        "is_fraud": False,
    }


def generate_fraudulent_transaction(user_id):
    category = random.choice(list(merchant_categories.keys()))
    min_amt, max_amt = merchant_categories[category]
    fraud_amount = round(random.uniform(max_amt * 2, max_amt * 10), 2)

    return {
        "transaction_id": str(uuid.uuid4()),
        "user_id": user_id,
        "amount": fraud_amount,
        "currency": "USD",
        "merchant_id": str(uuid.uuid4()),
        "merchant_category": category,
        "transaction_type": random.choice(transaction_types),
        "timestamp": datetime.utcnow().isoformat(),
        "location": {
            "country": random.choice(countries),  # скачки между странами
            "city": fake.city(),
        },
        "device_id": str(uuid.uuid4()),
        "is_fraud": True,
    }


# ===========================
# Main Loop
# ===========================
print(f"Producer started. TPS={TPS} FRAUD_RATIO={FRAUD_RATIO}")

while True:
    user_id = str(uuid.uuid4())

    is_fraud = random.random() < FRAUD_RATIO
    if is_fraud:
        tx = generate_fraudulent_transaction(user_id)
        FRAUD_COUNTER.inc()
    else:
        tx = generate_normal_transaction(user_id)

    AMOUNT_HISTOGRAM.observe(tx["amount"])
    TRANSACTION_COUNTER.inc()

    producer.send(TOPIC_NAME, tx)

    time.sleep(1 / TPS)

