import os
import json
import time
import uuid
import random
from datetime import datetime, timedelta
from faker import Faker
from kafka import KafkaProducer
from prometheus_client import Counter, start_http_server

fake = Faker()

# ======================
# CONFIG
# ======================
KAFKA_BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")
TRANSACTIONS_PER_SECOND = int(os.getenv("TRANSACTIONS_PER_SECOND", 10))
FRAUD_RATIO = float(os.getenv("FRAUD_RATIO", 0.05))
TOPIC_NAME = os.getenv("TOPIC_NAME", "transactions")

# ======================
# METRICS
# ======================
try:
    start_http_server(8000)
    METRIC_TOTAL = Counter("producer_transactions_total", "Total transactions generated")
    METRIC_FRAUD = Counter("producer_transactions_fraud", "Fraudulent transactions generated")
except Exception:
    METRIC_TOTAL = None
    METRIC_FRAUD = None

# Merchant categories & typical amount ranges
MERCHANT_CATEGORIES = {
    "grocery": (10, 150),
    "electronics": (50, 1500),
    "restaurants": (5, 200),
    "travel": (50, 1000),
    "atm": (20, 300)
}

COUNTRIES = ["US", "UK", "DE", "SG", "KZ", "AE", "AU"]
CITIES = ["New York", "London", "Berlin", "Singapore", "Almaty", "Dubai", "Sydney"]

# ======================
# TRANSACTION GENERATOR
# ======================

def generate_normal_transaction():
    category = random.choice(list(MERCHANT_CATEGORIES.keys()))
    amount_min, amount_max = MERCHANT_CATEGORIES[category]

    return {
        "transaction_id": str(uuid.uuid4()),
        "user_id": str(uuid.uuid4()),
        "amount": round(random.uniform(amount_min, amount_max), 2),
        "currency": "USD",
        "merchant_id": str(uuid.uuid4()),
        "merchant_category": category,
        "transaction_type": random.choice(["pos", "online", "atm"]),
        "timestamp": datetime.utcnow().isoformat(),
        "location": {
            "country": random.choice(COUNTRIES),
            "city": random.choice(CITIES)
        },
        "device_id": str(uuid.uuid4()),
        "is_fraud": False
    }

def generate_fraud_transaction():
    base = generate_normal_transaction()

    anomaly_type = random.choice(["large_amount", "geo_jump", "burst"])

    if anomaly_type == "large_amount":
        base["amount"] = round(base["amount"] * random.uniform(10, 50), 2)

    elif anomaly_type == "geo_jump":
        base["location"] = {
            "country": random.choice(COUNTRIES),
            "city": random.choice(CITIES)
        }
        base["timestamp"] = (datetime.utcnow() + timedelta(seconds=random.randint(-120, 120))).isoformat()

    elif anomaly_type == "burst":
        base["timestamp"] = datetime.utcnow().isoformat()
        # For burst pattern, user generates many transactions quickly
        # (Handled naturally by high TPS in producer)

    base["is_fraud"] = True
    return base


# ======================
# MAIN LOOP
# ======================

def main():
    # Keep trying to connect to Kafka; if connection drops, retry.
    interval = 1.0 / TRANSACTIONS_PER_SECOND

    while True:
        producer = None
        try:
            backoff = 1
            while True:
                try:
                    producer = KafkaProducer(
                        bootstrap_servers=KAFKA_BOOTSTRAP_SERVERS,
                        value_serializer=lambda v: json.dumps(v).encode("utf-8")
                    )
                    print(f"Producer connected to {KAFKA_BOOTSTRAP_SERVERS}. TPS={TRANSACTIONS_PER_SECOND}, FRAUD={FRAUD_RATIO}")
                    break
                except Exception as e:
                    print(f"Kafka connection failed: {e}. Retrying in {backoff}s...")
                    time.sleep(backoff)
                    backoff = min(backoff * 2, 30)

            # main send loop; if send fails, recreate producer
            while True:
                try:
                    is_fraud = random.random() < FRAUD_RATIO
                    tx = generate_fraud_transaction() if is_fraud else generate_normal_transaction()

                    producer.send(TOPIC_NAME, tx)

                    if METRIC_TOTAL:
                        METRIC_TOTAL.inc()
                        if is_fraud:
                            METRIC_FRAUD.inc()

                    time.sleep(interval)

                except Exception as e:
                    print(f"Send failed: {e}. Will attempt to reconnect to Kafka.")
                    try:
                        producer.close()
                    except Exception:
                        pass
                    break

        except KeyboardInterrupt:
            print("Producer interrupted, exiting")
            try:
                if producer:
                    producer.close()
            except Exception:
                pass
            raise
        except Exception as e:
            print(f"Unexpected error in producer loop: {e}. Sleeping 5s before retry.")
            try:
                if producer:
                    producer.close()
            except Exception:
                pass
            time.sleep(5)


if __name__ == "__main__":
    main()

