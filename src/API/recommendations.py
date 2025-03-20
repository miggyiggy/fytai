from fastapi import FastAPI, HTTPException, Query
from pydantic import BaseModel
import pandas as pd
import pickle
import logging
import os
import subprocess  # For running the main.py script
import json

app = FastAPI()

logging.basicConfig(level=logging.INFO)

class UserInput(BaseModel):
    Age: int
    Gender: str
    Level: str
    Weight_kg: float
    Height_m: float
    Resting_BPM: int
    Fat_Percentage: float
    Water_Intake_liters: float
    Workout_Frequency_days_week: int
    Workout_Days: int
    Exercises_Per_Day: int
    Preferred_Workout: str
    Focused_Body_Parts: str  # Comma-separated string

def run_main_script(user_data):
    """Runs the main.py script with user data and returns the workout plan."""
    try:
        # Create a temporary JSON file to pass user data to main.py
        user_data_file = "user_data.json"
        with open(user_data_file, "w") as f:
            json.dump(user_data, f)

        # Run main.py with command-line arguments
        members_file = "gym_members.csv"  # Replace with actual file path
        exercises_file = "exercises.csv"  # Replace with actual file path
        result = subprocess.run(
            [
                "python",
                "main.py",
                "--members_file",
                members_file,
                "--exercises_file",
                exercises_file,
            ],
            capture_output=True,
            text=True,
            input=f"--user_data_file={user_data_file}",
            shell=True,
        )

        # Delete the temporary JSON file
        os.remove(user_data_file)

        if result.returncode == 0:
            # Parse the output from main.py (assuming it's a JSON string)
            output = result.stdout.strip()
            # Extract the workout plan part from the output.
            workout_plan_start = output.find("AI-Generated Workout Plan:")
            if workout_plan_start != -1:
                workout_plan_str = output[workout_plan_start:]
                # Convert the workout plan string to a JSON object
                workout_plan_json = {}
                current_day = None
                for line in workout_plan_str.split('\n'):
                    line = line.strip()
                    if line.startswith('Day'):
                        current_day = line[:-1]
                        workout_plan_json[current_day] = []
                    elif line.startswith('Exercise'):
                        exercise_data = {}
                        exercise_data['Exercise'] = line.split('(')[0].replace('Exercise:', '').strip()
                        exercise_data['Type'] = line.split('(')[1].split(')')[0].strip()
                        workout_plan_json[current_day].append(exercise_data)
                return workout_plan_json
            else:
                logging.error("Workout plan not found in main.py output.")
                return None
        else:
            logging.error(f"main.py script failed: {result.stderr}")
            return None
    except Exception as e:
        logging.error(f"Error running main.py: {e}")
        return None

@app.post("/api/workout_plan")
async def generate_workout_plan(user_input: UserInput):
    """Generates a workout plan using the main.py script."""
    try:
        user_data = user_input.dict()
        user_data["Focused_Body_Parts"] = [
            part.strip() for part in user_data["Focused_Body_Parts"].split(",")
        ]
        workout_plan = run_main_script(user_data)
        if workout_plan:
            return workout_plan
        else:
            raise HTTPException(status_code=500, detail="Failed to generate workout plan.")
    except Exception as e:
        logging.error(f"API error: {e}")
        raise HTTPException(status_code=500, detail=str(e))