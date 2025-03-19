from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserInput(BaseModel):
    weight: float
    height: float
    gender: str
    body_part: str
    level: str

try:
    with open('trainedmodel.pkl', 'rb') as f:
        tfidf_matrix, tfidf_vectorizer = pickle.load(f)
except FileNotFoundError:
    print("" Error: trainedmodel.pkl not found!")
    tfidf_matrix, tfidf_vectorizer = None, None

def calculate_bmi(weight, height):
    if height <= 0:
        raise ValueError("Height must be greater than zero")
    return round(weight / (height ** 2), 2)

def get_fitness_goal(bmi):
    if bmi < 18.5:
        return "Gain weight and build muscle."
    elif 18.5 <= bmi < 25:
        return "Maintain a healthy weight and focus on overall fitness."
    elif 25 <= bmi < 30:
        return "Lose weight and improve cardiovascular health."
    else:
        return "Consult a healthcare professional for personalized advice."

@app.post("/api/recommendations")
async def process_user_data(user_input: UserInput):
    try:
        bmi = calculate_bmi(user_input.weight, user_input.height)
        fitness_goal = get_fitness_goal(bmi)

        if not tfidf_vectorizer or not tfidf_matrix:
            raise HTTPException(status_code=500, detail="Model is not loaded properly")

        user_vector = tfidf_vectorizer.transform(
            [f"{user_input.gender} {user_input.body_part} {user_input.level}"]
        )

        similarities = cosine_similarity(user_vector, tfidf_matrix)
        recommended_index = np.argmax(similarities)

        return {
            "bmi": bmi,
            "fitness_goal": fitness_goal,
            "recommended_plan_index": int(recommended_index)
        }
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
