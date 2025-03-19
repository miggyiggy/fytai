from fastapi import FastAPI
from pydantic import BaseModel
import sqlite3
import pickle
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allows requests from your React app
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

# Load the trained model
with open('trainedmodel.pkl', 'rb') as f:
    tfidf_matrix, tfidf_vectorizer = pickle.load(f)

def calculate_bmi(weight, height):
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
    bmi = calculate_bmi(user_input.weight, user_input.height)
    fitness_goal = get_fitness_goal(bmi)
    return {
        "bmi": bmi,
        "fitness_goal": fitness_goal
    }
