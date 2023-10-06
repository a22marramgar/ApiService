import json
import pandas as pd

df = pd.read_json('respondidas.json')
    
def calcular_porcentaje(respuestas):
    respuestas_correctas = sum(respuesta['esCorrecta'] for respuesta in respuestas)
    total_respuestas = len(respuestas)
    porcentaje = (respuestas_correctas / total_respuestas) * 100
    return porcentaje



# Crear un DataFrame separado para las respuestas seleccionadas
respuestas_df = pd.DataFrame(
    [(respuesta['id'], respuesta['esCorrecta']) for respuestas in df['respostes'] for respuesta in respuestas],
    columns=['id', 'esCorrecta'],
    
)
# Calcular el porcentaje de respuestas correctas por cada id
porcentaje_correctas_por_id = respuestas_df.groupby('id')['esCorrecta'].mean() * 100

# Mostrar las respuestas seleccionadas agrupadas por el id
respuestas_agrupadas = respuestas_df.groupby('id')['esCorrecta'].value_counts().unstack(fill_value=0)
respuestas_agrupadas['porcentaje_correctas'] = (respuestas_agrupadas[True] / (respuestas_agrupadas[True] + respuestas_agrupadas[False])) * 100
print(respuestas_agrupadas)
count_respuestas= len(df)
print(f"respuestas enviadas: {count_respuestas:} ")
promedio_tiempo=df['tiempo'].mean()
print(f"promedio tiempo de respuestas: {promedio_tiempo:.2f} segundos ")