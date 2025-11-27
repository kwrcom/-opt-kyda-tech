import os
import time
from kafka import KafkaConsumer

BOOTSTRAP_SERVERS = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "kafka:9092")
TOPIC = os.getenv("KAFKA_TOPIC", "transactions.raw")
GROUP_ID = os.getenv("KAFKA_GROUP_ID", "test-consumer-group")


def create_consumer():
    while True:
        try:
            print(f"[CONSUMER] Connecting to Kafka at {BOOTSTRAP_SERVERS}...")
            consumer = KafkaConsumer(
                TOPIC,
                bootstrap_servers=BOOTSTRAP_SERVERS,
                group_id=GROUP_ID,
                auto_offset_reset="latest",  # читать новые сообщения
                enable_auto_commit=True,
                value_deserializer=lambda v: v.decode("utf-8"),
            )
            print("[CONSUMER] Connected and subscribed.")
            return consumer
        except Exception as e:
            print(f"[CONSUMER] Kafka not ready: {e}. Retry in 5s...")
            time.sleep(5)


def main():
    consumer = create_consumer()
    for msg in consumer:
        print(f"[CONSUMER] Received: {msg.value}")


if __name__ == "__main__":
    main()
