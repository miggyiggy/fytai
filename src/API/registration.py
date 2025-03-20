from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import bcrypt  # For password hashing

app = FastAPI()

origins = [
    "http://localhost:3000",  # Your React app's origin
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UserRegistration(BaseModel):
    username: str
    email: str
    password: str

def create_users_table():
    try:
        conn = sqlite3.connect("user_database.db")
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE NOT NULL,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL
            )
        """)
        conn.commit()
        conn.close()
    except sqlite3.Error as e:
        print(f"Error creating users table: {e}")

create_users_table()

@app.post("/api/register")
async def register_user(user: UserRegistration):
    try:
        conn = sqlite3.connect("user_database.db")
        cursor = conn.cursor()

        # Check if username or email already exists
        cursor.execute("SELECT * FROM users WHERE username = ? OR email = ?", (user.username, user.email))
        existing_user = cursor.fetchone()

        if existing_user:
            conn.close()
            raise HTTPException(status_code=400, detail="Username or email already exists")

        # Hash the password
        hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())

        cursor.execute("INSERT INTO users (username, email, password) VALUES (?, ?, ?)", (user.username, user.email, hashed_password.decode('utf-8'))) # Store hashed password
        conn.commit()
        conn.close()
        return {"message": "User registered successfully"}
    except sqlite3.Error as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")
    except HTTPException as e:
        raise e  # Re-raise HTTP exceptions