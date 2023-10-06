import json
import pandas as pd

df = pd.read_json('respondidas.json')
def show_stats(df):
    print(df)
    promedio_tiempo=df['tiempo'].mean()
    print(f"promedio tiempo de respuestas: {promedio_tiempo:.2f} segundos ")
    
show_stats(df)