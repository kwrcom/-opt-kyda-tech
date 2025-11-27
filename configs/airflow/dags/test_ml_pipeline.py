
from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
import pandas as pd
import numpy as np
import mlflow
import mlflow.sklearn
import logging

default_args = {
    'owner': 'airflow',
    'depends_on_past': False,
    'start_date': datetime(2024, 1, 1),
    'email_on_failure': False,
    'email_on_retry': False,
    'retries': 1,
    'retry_delay': timedelta(minutes=5),
}

def extract_data():
    """Генерация случайных данных"""
    np.random.seed(42)
    data = {
        'feature1': np.random.randn(100),
        'feature2': np.random.randn(100),
        'target': np.random.randint(0, 2, 100)
    }
    df = pd.DataFrame(data)
    logging.info(f"Generated data with shape: {df.shape}")
    return df.to_json()

def preprocess_data(ti):
    """Обработка данных"""
    import pandas as pd
    import numpy as np
    
    data_json = ti.xcom_pull(task_ids='extract_data')
    df = pd.read_json(data_json)
    
    # Простая предобработка
    df['feature1_normalized'] = (df['feature1'] - df['feature1'].mean()) / df['feature1'].std()
    df['feature2_normalized'] = (df['feature2'] - df['feature2'].mean()) / df['feature2'].std()
    
    logging.info(f"Processed data shape: {df.shape}")
    logging.info(f"Feature means: {df[['feature1_normalized', 'feature2_normalized']].mean()}")
    
    return df.to_json()

def train_model(ti):
    """Имитация тренировки модели с логированием в MLflow"""
    import pandas as pd
    import numpy as np
    from sklearn.linear_model import LogisticRegression
    from sklearn.model_selection import train_test_split
    from sklearn.metrics import accuracy_score, precision_score, recall_score
    
    data_json = ti.xcom_pull(task_ids='preprocess_data')
    df = pd.read_json(data_json)
    
    # Подготовка данных
    X = df[['feature1_normalized', 'feature2_normalized']]
    y = df['target']
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # Настройка MLflow
    mlflow.set_tracking_uri("http://mlflow-server:5000")
    mlflow.set_experiment("airflow-test-experiment")
    
    with mlflow.start_run():
        # Имитация тренировки модели
        model = LogisticRegression(random_state=42)
        model.fit(X_train, y_train)
        
        # Предсказания и метрики
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        precision = precision_score(y_test, y_pred)
        recall = recall_score(y_test, y_pred)
        
        # Логирование параметров и метрик
        mlflow.log_param("model_type", "LogisticRegression")
        mlflow.log_param("random_state", 42)
        mlflow.log_metric("accuracy", accuracy)
        mlflow.log_metric("precision", precision)
        mlflow.log_metric("recall", recall)
        
        # Логирование модели
        mlflow.sklearn.log_model(model, "model")
        
        logging.info(f"Model trained with accuracy: {accuracy:.3f}")
        logging.info(f"Metrics logged to MLflow: accuracy={accuracy:.3f}, precision={precision:.3f}, recall={recall:.3f}")

with DAG(
    'test_ml_pipeline',
    default_args=default_args,
    description='Тестовый ML пайплайн',
    schedule_interval=timedelta(days=1),
    catchup=False,
    tags=['ml', 'test'],
) as dag:

    extract_task = PythonOperator(
        task_id='extract_data',
        python_callable=extract_data,
    )

    preprocess_task = PythonOperator(
        task_id='preprocess_data',
        python_callable=preprocess_data,
    )

    train_task = PythonOperator(
        task_id='train_model',
        python_callable=train_model,
    )

    extract_task >> preprocess_task >> train_task
