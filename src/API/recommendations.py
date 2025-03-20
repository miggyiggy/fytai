from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
import sqlite3
import pickle
from sklearn.metrics.pairwise import cosine_similarity
import logging
import os  # Import os module for path manipulation

app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.ERROR)  # Log errors and above

class UserInput(BaseModel):
    weight: float
    height: float
    body_part: str
    level: str
    days_per_week: int

# Construct the absolute path to main.pkl
script_dir = os.path.dirname(os.path.abspath(__file__))  # Get the directory of the current script
model_path = os.path.join(script_dir, '..', 'AI', 'main.pkl')

# Load the trained model
try:
    with open(model_path, 'rb') as f:
        tfidf_matrix, tfidf_vectorizer, another_object = pickle.load(f)
except FileNotFoundError:
    logging.error(f"main.pkl not found at {model_path}")
    tfidf_matrix, tfidf_vectorizer = None, None

def calculate_bmi(weight, height):
    """Calculates BMI."""
    if height <= 0:
        return "Invalid height"
    return round(weight / (height ** 2), 2)

def determine_fitness_goal(bmi):
    """Determines fitness goal based on BMI."""
    if isinstance(bmi, str):
        return "Cannot determine fitness goal due to invalid BMI"
    if bmi < 18.5:
        return "Gain weight"
    elif 18.5 <= bmi < 25:
        return "Maintain weight"
    elif 25 <= bmi < 30:
        return "Lose weight"
    else:
        return "Lose weight (consult a doctor)"

# Construct the absolute path to gym_database.db
db_path = os.path.join(script_dir, 'gym_database.db')

# Create the Exercises table during application startup
try:
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS Exercises (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            description TEXT
            -- Add other columns as needed
        )
    """)
    conn.commit()
    conn.close()
    print("Exercises table created or already existed.")
except sqlite3.Error as e:
    logging.error(f"Database error during table creation: {e}")

def get_workout_recommendations(body_part, level):
    """Generates workout recommendations using the trained model."""
    try:
        conn_workouts = sqlite3.connect(db_path)
        cursor_workouts = conn_workouts.cursor()

        cursor_workouts.execute("SELECT title, description FROM Exercises")
        exercises = cursor_workouts.fetchall()
        conn_workouts.close()

        if not exercises:
            raise HTTPException(status_code=404, detail="No exercises found.")

        query = f"{body_part} {level}"
        query_tfidf = tfidf_vectorizer.transform([query])
        similarity_scores = cosine_similarity(query_tfidf, tfidf_matrix).flatten()
        top_indices = similarity_scores.argsort()[-min(5, len(similarity_scores)):][::-1]

        recommendations = [
            {"title": exercises[i][0], "description": exercises[i][1]}
            for i in top_indices
        ]
        return recommendations

    except sqlite3.Error as e:
        logging.error(f"Database error: {e}")
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    except Exception as e:
        logging.error(f"An unexpected error occurred: {e}")
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {e}")

@app.get("/api/recommendations")
async def recommend_workouts(
    weight: float = Query(..., description="User's weight"),
    height: float = Query(..., description="User's height"),
    body_part: str = Query(..., description="Target muscle group"),
    level: str = Query(..., description="Fitness level"),
    days_per_week: int = Query(..., description="Days per week to workout"),
):
    """API endpoint to get workout recommendations."""
    bmi = calculate_bmi(weight, height)
    fitness_goal = determine_fitness_goal(bmi)
    recommendations = get_workout_recommendations(body_part, level)

    return {
        "bmi": bmi,
        "fitness_goal": fitness_goal,
        "recommendations": recommendations,
    }