from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
import random
import mlflow

def extract_data():
    return [random.random() for _ in range(5)]

def preprocess_data(**context):
    data = context['ti'].xcom_pull(task_ids='extract_data')
    return [x * 2 for x in data]

def train_model(**context):
    data = context['ti'].xcom_pull(task_ids='preprocess_data')
    mlflow.set_experiment("airflow-test")
    with mlflow.start_run():
        mlflow.log_param("dataset_size", len(data))
        mlflow.log_metric("mean_value", sum(data)/len(data))

default_args = {
    'owner': 'airflow',
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=1)
}

with DAG(
    'test_ml_pipeline',
    default_args=default_args,
    start_date=datetime(2024, 1, 1),
    schedule_interval='@once',
    catchup=False
):

    t1 = PythonOperator(task_id='extract_data', python_callable=extract_data)
    t2 = PythonOperator(task_id='preprocess_data', python_callable=preprocess_data)
    t3 = PythonOperator(task_id='train_model', python_callable=train_model)

    t1 >> t2 >> t3

