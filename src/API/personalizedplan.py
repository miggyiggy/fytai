from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import sqlite3

app = FastAPI()

class UserInput(BaseModel):
    weight: float
    height: float
    gender: str
    body_part: str
    level: str

def calculate_bmi(weight, height):
    """Calculates BMI."""
    try:
        height_meters = float(height)
        weight_kg = float(weight)
        if height_meters <= 0:
            return 0
        return weight_kg / (height_meters * height_meters)
    except ValueError:
        return 0

def get_fitness_goal(bmi, gender):
    """Determines fitness goal based on BMI."""
    if bmi < 18.5:
        return "Gain weight and build muscle."
    elif 18.5 <= bmi < 25:
        return "Maintain a healthy weight and focus on overall fitness."
    elif 25 <= bmi < 30:
        return "Lose weight and improve cardiovascular health."
    else:
        return "Consult a healthcare professional for personalized advice."

@app.post("/api/calculate_bmi")
async def calculate_bmi_api(user_input: UserInput):
    """API endpoint to calculate BMI and store data."""
    bmi = calculate_bmi(user_input.weight, user_input.height)
    fitness_goal = get_fitness_goal(bmi, user_input.gender)

    # Store data in the database
    conn = sqlite3.connect("fitness_data.db")
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO fitness_data (weight_kg, height_cm, gender, body_part, level, bmi, fitness_goal)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        """,
        (
            user_input.weight,
            user_input.height,
            user_input.gender,
            user_input.body_part,
            user_input.level,
            bmi,
            fitness_goal,
        ),
    )
    conn.commit()
    conn.close()

    return {"bmi": bmi, "fitness_goal": fitness_goal}