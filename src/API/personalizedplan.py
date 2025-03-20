from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pickle
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
import sqlite3
import logging

app = FastAPI()

origins = [
    "http://localhost:3000",  # Corrected CORS origin
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserInput(BaseModel):
    weight: float
    height: float
    body_part: str
    level: str
    days_per_week: int

try:
    with open('../AI/trained_model.pkl', 'rb') as f:
        tfidf_matrix, tfidf_vectorizer = pickle.load(f)
except FileNotFoundError:
    print("Error: trained_model.pkl not found!")
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

def get_recommended_plan(index):
    try:
        conn = sqlite3.connect("gym_database.db")
        cursor = conn.cursor()
        cursor.execute("SELECT title, description FROM Exercises WHERE id = ?", (index + 1,))
        result = cursor.fetchone()
        conn.close()
        if result:
            return {"title": result[0], "description": result[1]}
        else:
            return None
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@app.get("/api/recommendations")
async def process_user_data(
    weight: float = Query(..., description="User's weight"),
    height: float = Query(..., description="User's height"),
    body_part: str = Query(..., description="Target body part"),
    level: str = Query(..., description="Fitness level"),
    days_per_week: int = Query(..., description="Days per week to workout"),
):
    try:
        bmi = calculate_bmi(weight, height)
        fitness_goal = get_fitness_goal(bmi)

        if not tfidf_vectorizer or not tfidf_matrix:
            raise HTTPException(status_code=500, detail="Model is not loaded properly")

        user_vector = tfidf_vectorizer.transform(
            [f"{body_part} {level}"]
        )

        similarities = cosine_similarity(user_vector, tfidf_matrix)
        recommended_index = np.argmax(similarities)

        recommended_plan = get_recommended_plan(recommended_index)

        return {
            "bmi": bmi,
            "fitness_goal": fitness_goal,
            "recommended_plan": recommended_plan,
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))