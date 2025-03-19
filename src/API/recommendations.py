# main.py (FastAPI)
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3
import pickle
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

class UserInput(BaseModel):
    weight: float
    height: float
    gender: str
    body_part: str
    level: str

# Load the trained model
with open('trainedmodel.pkl', 'rb') as f:
    tfidf_matrix, tfidf_vectorizer = pickle.load(f)

def get_workout_recommendations(body_part, level):
    """Generates workout recommendations using the trained model."""
    conn_workouts = sqlite3.connect("gym_database.db")
    cursor_workouts = conn_workouts.cursor()

    # Fetch exercise descriptions from the database
    cursor_workouts.execute("SELECT `#title`, description FROM Exercises")
    exercises = cursor_workouts.fetchall()
    conn_workouts.close()

    if not exercises:
        raise HTTPException(status_code=404, detail="No exercises found.")

    # Create a query based on body_part and level (you might need to refine this)
    query = f"{body_part} {level}"

    # Transform the query using the TF-IDF vectorizer
    query_tfidf = tfidf_vectorizer.transform([query])

    # Calculate cosine similarity
    similarity_scores = cosine_similarity(query_tfidf, tfidf_matrix).flatten()

    # Get the top 5 recommendations (adjust as needed)
    top_indices = similarity_scores.argsort()[-5:][::-1]

    recommendations = [
        {"title": exercises[i][0], "description": exercises[i][1]}
        for i in top_indices
    ]
    return recommendations

@app.post("/api/recommendations")
async def recommend_workouts(user_input: UserInput):
    """API endpoint to get workout recommendations."""
    recommendations = get_workout_recommendations(user_input.body_part, user_input.level)
    return {"recommendations": recommendations}