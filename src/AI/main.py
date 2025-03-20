import argparse
import logging
import os
import random
import sys

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_selection import SelectKBest, mutual_info_classif
from sklearn.impute import SimpleImputer
from sklearn.metrics import balanced_accuracy_score
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler, OneHotEncoder, PolynomialFeatures

from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline

# Optional: Suppress NumPy runtime warnings if desired.
np.seterr(invalid='ignore')

# Set up logging and global random seed for reproducibility
logging.basicConfig(level=logging.INFO)
random.seed(42)
np.random.seed(42)


# ------------------------------
# Helper Functions
# ------------------------------
def get_valid_input(prompt, input_type, valid_range=None):
    """Prompts the user until a valid input (within valid_range if provided) is entered."""
    while True:
        try:
            user_input = input(prompt)
            value = input_type(user_input)
            if valid_range and not (valid_range[0] <= value <= valid_range[1]):
                print(f"Please enter a value between {valid_range[0]} and {valid_range[1]}.")
                continue
            return value
        except ValueError:
            print("Invalid input. Please try again.")


def get_valid_option(prompt, options):
    """Prompts the user until a valid option is selected."""
    options_str = "/".join(options)
    while True:
        choice = input(f"{prompt} ({options_str}): ").strip().capitalize()
        if choice in [opt.capitalize() for opt in options]:
            return choice
        print("Invalid option. Please try again.")


def get_valid_options(prompt, allowed_options):
    """
    Prompts the user to enter a comma-separated list of options.
    Returns a list of validated options (case-insensitive).
    """
    print(f"{prompt} (choose from: {', '.join(allowed_options)})")
    while True:
        response = input("Enter comma-separated options (or leave blank for none): ")
        if not response.strip():
            return []  # No selection
        selections = [item.strip().capitalize() for item in response.split(',')]
        if all(sel in [opt.capitalize() for opt in allowed_options] for sel in selections):
            return selections
        print("One or more selections were invalid. Please try again.")


def determine_sets(level):
    """
    Determines the number of sets with some random variation based on experience level.
    """
    mapping = {
        'Beginner': (3, 4),
        'Intermediate': (3, 5),
        'Advanced': (4, 6)
    }
    low, high = mapping.get(level, (3, 4))
    return random.randint(low, high)


def determine_reps(level, exercise_type):
    """
    Determines the number of reps with some random variation based on experience level and exercise type.
    For strength/power based exercises, the rep range is slightly lower.
    """
    if exercise_type.lower() in ['strength', 'powerlifting', 'olympic weightlifting', 'strongman', 'plyometrics']:
        mapping = {
            'Beginner': (8, 10),
            'Intermediate': (10, 12),
            'Advanced': (12, 15)
        }
    else:
        mapping = {
            'Beginner': (12, 15),
            'Intermediate': (15, 18),
            'Advanced': (18, 22)
        }
    low, high = mapping.get(level, (10, 15))
    return random.randint(low, high)


# ------------------------------
# Custom Transformer for Advanced Feature Engineering
# ------------------------------
class AdvancedFeatureEngineer(BaseEstimator, TransformerMixin):
    """
    Custom transformer that creates advanced features (BMI, FFMI, etc.)
    and handles temporal features if present. For prediction data,
    if some columns are missing, default values are added.
    """

    def __init__(self):
        pass

    def fit(self, X, y=None):
        return self

    def transform(self, X):
        X = X.copy()
        if 'Calories_Burned' not in X.columns:
            X['Calories_Burned'] = 0.0
        if 'Session_Duration (hours)' not in X.columns:
            X['Session_Duration (hours)'] = 1.0
        if 'Max_BPM' not in X.columns and 'Resting_BPM' in X.columns:
            X['Max_BPM'] = X['Resting_BPM'] + 40
        if 'Timestamp' in X.columns:
            try:
                ts = pd.to_datetime(X['Timestamp'], errors='coerce')
                X['Workout_Hour'] = ts.dt.hour
                X['Is_Weekend'] = ts.dt.weekday >= 5
            except Exception as e:
                logging.warning(f"Timestamp conversion issue: {e}")
        if all(col in X.columns for col in ['Weight (kg)', 'Height_m']):
            X['BMI'] = X['Weight (kg)'] / (X['Height_m'] ** 2)
        if all(col in X.columns for col in ['Weight (kg)', 'Height_m', 'Fat_Percentage']):
            X['FFMI'] = (X['Weight (kg)'] * (1 - X['Fat_Percentage'] / 100)) / (X['Height_m'] ** 2)
        if all(col in X.columns for col in ['Resting_BPM', 'Age', 'Water_Intake (liters)']):
            X['Metabolic_Age'] = X['Resting_BPM'] + (X['Age'] * 0.25) - (X['Water_Intake (liters)'] * 2)
        if all(col in X.columns for col in ['Calories_Burned', 'Session_Duration (hours)']):
            X['Caloric_Efficiency'] = X['Calories_Burned'] / (X['Session_Duration (hours)'] + 1e-6)
        if all(col in X.columns for col in ['Water_Intake (liters)', 'Session_Duration (hours)']):
            X['Recovery_Ratio'] = X['Water_Intake (liters)'] / (X['Session_Duration (hours)'] + 1e-6)
        if all(col in X.columns for col in ['Weight (kg)', 'Fat_Percentage']):
            X['Lean_Body_Mass'] = X['Weight (kg)'] * (1 - X['Fat_Percentage'] / 100)
        if all(col in X.columns for col in ['Water_Intake (liters)', 'Weight (kg)']):
            X['Hydration_Index'] = X['Water_Intake (liters)'] / X['Weight (kg)']
        if all(col in X.columns for col in ['Max_BPM', 'Resting_BPM']):
            X['Cardio_Stress'] = (X['Max_BPM'] - X['Resting_BPM']) / X['Resting_BPM']
        X.fillna(0, inplace=True)
        return X


# ------------------------------
# Data Loading Function
# ------------------------------
def load_and_merge_datasets(file1, file2):
    """Loads and merges two datasets after cleaning and basic feature engineering."""
    if not os.path.exists(file1) or not os.path.exists(file2):
        raise FileNotFoundError("Dataset files not found. Check file paths.")
    try:
        df_members = pd.read_csv(file1)
        df_exercises = pd.read_csv(file2)
    except Exception as e:
        raise ValueError(f"Error loading datasets: {str(e)}")
    df_exercises = df_exercises.drop(columns=["Unnamed: 0", "Desc", "Rating", "RatingDesc"], errors='ignore')
    if 'Type' in df_exercises.columns:
        df_exercises['Type'] = df_exercises['Type'].str.replace(' ', '_').str.title()
    df_members = df_members.rename(columns={
        "Workout_Type": "Type",
        "Experience_Level": "Level",
        "Height (m)": "Height_m"
    })
    df_members['Level'] = df_members['Level'].astype(str)
    if 'Level' in df_exercises.columns:
        df_exercises['Level'] = df_exercises['Level'].astype(str)
    df_members['Level'] = df_members['Level'].replace({'1': 'Beginner', '2': 'Intermediate', '3': 'Advanced'})
    df_members['Type'] = df_members['Type'].replace({
        'HIIT': 'High_Intensity',
        'Yoga': 'Flexibility',
        'Strength': 'Strength'
    })
    merged_df = pd.merge(df_members, df_exercises,
                         on=["Type", "Level"],
                         how="inner",
                         validate="many_to_many")
    return merged_df, df_members


# ------------------------------
# Model Training Function
# ------------------------------
def train_fitness_goal_model(df):
    """
    Trains a RandomForest model with hyperparameter tuning using advanced features.
    The target "Fitness_Goal" is computed based on BMI and Fat_Percentage.
    """
    df_temp = AdvancedFeatureEngineer().transform(df.copy())
    conditions = [
        (df_temp['BMI'] < 18.5),
        (df_temp['BMI'] >= 18.5) & (df_temp['BMI'] < 24.9),
        (df_temp['BMI'] >= 24.9) & (df_temp['Fat_Percentage'] > 20),
        (df_temp['BMI'] >= 24.9) & (df_temp['Fat_Percentage'] <= 20)
    ]
    choices = ['Muscle_Gain', 'General_Fitness', 'Fat_Loss', 'General_Fitness']
    df_temp['Fitness_Goal'] = np.select(conditions, choices, default='General_Fitness')
    all_features = [
        'Age', 'Gender', 'BMI', 'FFMI', 'Resting_BPM', 'Workout_Frequency (days/week)',
        'Level', 'Fat_Percentage', 'Water_Intake (liters)', 'Caloric_Efficiency',
        'Recovery_Ratio', 'Lean_Body_Mass', 'Hydration_Index', 'Cardio_Stress'
    ]
    features = [f for f in all_features if f in df_temp.columns]
    logging.info(f"Using features: {features}")
    numeric_features = [f for f in features if f not in ['Gender', 'Level']]
    categorical_features = [f for f in features if f in ['Gender', 'Level']]
    preprocessor = ColumnTransformer([
        ('num', Pipeline([
            ('imputer', SimpleImputer(strategy='median')),
            ('poly', PolynomialFeatures(degree=2, interaction_only=True)),
            ('scaler', StandardScaler())
        ]), numeric_features),
        ('cat', Pipeline([
            ('imputer', SimpleImputer(strategy='most_frequent')),
            ('onehot', OneHotEncoder(handle_unknown='ignore', sparse_output=False))
        ]), categorical_features)
    ])
    pipeline = ImbPipeline([
        ('advanced_features', AdvancedFeatureEngineer()),
        ('preprocessor', preprocessor),
        ('feature_selection', SelectKBest(mutual_info_classif, k=min(20, len(features)))),
        ('smote', SMOTE(sampling_strategy='not majority', random_state=42)),
        ('classifier', RandomForestClassifier(class_weight='balanced', random_state=42))
    ])
    X = df.copy()
    y = df_temp['Fitness_Goal']
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    param_dist = {
        'classifier__n_estimators': np.arange(100, 501, 100),
        'classifier__max_depth': [None, 10, 20, 30],
        'classifier__min_samples_split': [2, 5, 10],
        'classifier__max_features': ['sqrt', 'log2', 0.3, 0.5],
        'feature_selection__k': [min(15, len(features)), min(20, len(features)), min(25, len(features))],
        'preprocessor__num__poly__degree': [1, 2],
        'smote__k_neighbors': [3, 5, 7]
    }
    search = RandomizedSearchCV(
        pipeline, param_dist, n_iter=50, cv=3,
        scoring='balanced_accuracy', n_jobs=-1, verbose=2, random_state=42
    )
    search.fit(X_train, y_train)
    best_model = search.best_estimator_
    logging.info(f"Best Parameters: {search.best_params_}")
    logging.info(f"Validation Accuracy: {search.best_score_:.3f}")
    y_pred = best_model.predict(X_test)
    logging.info(f"Test Balanced Accuracy: {balanced_accuracy_score(y_test, y_pred):.3f}")
    plot_feature_importances(best_model)
    return best_model


# ------------------------------
# Plotting Function
# ------------------------------
def plot_feature_importances(model):
    """Visualizes the top 20 feature importances."""
    try:
        all_feature_names = model.named_steps['preprocessor'].get_feature_names_out()
        mask = model.named_steps['feature_selection'].get_support()
        selected_feature_names = all_feature_names[mask]
    except Exception as e:
        logging.warning(f"Could not retrieve feature names properly: {e}")
        selected_feature_names = [f"Feature_{i}" for i in
                                  range(len(model.named_steps['classifier'].feature_importances_))]
    importances = model.named_steps['classifier'].feature_importances_
    importance_df = pd.DataFrame({
        'Feature': selected_feature_names,
        'Importance': importances
    }).sort_values('Importance', ascending=False)
    plt.figure(figsize=(12, 8))
    sns.barplot(x='Importance', y='Feature', data=importance_df.head(20))
    plt.title('Top 20 Feature Importances')
    plt.tight_layout()
    plt.show()


# ------------------------------
# Workout Plan Generation Functions
# ------------------------------
def generate_ml_workout_plan(user_data, merged_df, predicted_focus, preferred_workout=None, focused_body_parts=None):
    """
    Generates a personalized workout plan based on the model's predicted fitness focus,
    optional preferred workout type, and optionally focused body parts.

    Modifications for variety and realism include:
      - Mixing primary and secondary exercise types per day.
      - Randomizing the number of sets and reps for each exercise.
      - Inserting extra HIIT/cardio exercises on a random day if needed.
    """
    expanded_focus_exercise_mapping = {
        'Fat_Loss': ['HIIT', 'Cardio', 'Strength', 'Plyometrics', 'Stretching'],
        'Muscle_Gain': ['Strength', 'Powerlifting', 'Olympic Weightlifting', 'Strongman', 'Plyometrics'],
        'General_Fitness': ['Cardio', 'Strength', 'Stretching', 'Flexibility', 'Balance'],
        'Weight_Loss': ['HIIT', 'Cardio', 'Plyometrics', 'Strength', 'Circuit Training']
    }
    if preferred_workout and preferred_workout != "Mixed":
        base_types = expanded_focus_exercise_mapping.get(predicted_focus, ['Cardio', 'Strength', 'Stretching'])
        weighted_types = []
        for t in base_types:
            if t.lower() == preferred_workout.lower():
                weighted_types.extend([t] * 3)
            else:
                weighted_types.append(t)
        available_types = weighted_types
    else:
        available_types = expanded_focus_exercise_mapping.get(predicted_focus, ['Cardio', 'Strength', 'Stretching'])

    days = user_data['Workout_Days']
    exercises_per_day = user_data['Exercises_Per_Day']
    workout_plan = {}

    essential_body_parts = ["Chest", "Back", "Legs", "Shoulders", "Core"]

    for day in range(1, days + 1):
        # Choose a primary exercise type and, if possible, a different secondary type
        primary_type = random.choice(available_types)
        secondary_options = [t for t in available_types if t.lower() != primary_type.lower()]
        secondary_type = random.choice(secondary_options) if secondary_options else primary_type

        # Split the day's exercises into primary and secondary groups
        primary_count = max(1, int(round(exercises_per_day * 0.7)))
        secondary_count = exercises_per_day - primary_count

        # Pools for each type (filtering on type in a case-insensitive way)
        primary_pool = merged_df[merged_df['Type'].str.lower() == primary_type.lower()]
        secondary_pool = merged_df[merged_df['Type'].str.lower() == secondary_type.lower()] if secondary_type != primary_type else primary_pool

        # If a pool is empty, fall back to the entire merged dataset
        if primary_pool.empty:
            primary_pool = merged_df
        if secondary_pool.empty:
            secondary_pool = merged_df

        selected_exercises = []

        # Sample extra exercises from focused body parts (up to one per group) from primary pool
        if focused_body_parts:
            for bp in focused_body_parts:
                bp_group = primary_pool[primary_pool['BodyPart'].str.lower() == bp.lower()]
                if not bp_group.empty:
                    selected_exercises.append(bp_group.sample(n=1))

        # Fill the primary count from primary pool, excluding already selected exercises
        already_selected = pd.concat(selected_exercises).index if selected_exercises else pd.Index([])
        remaining_primary = primary_pool.drop(index=already_selected, errors='ignore')
        if remaining_primary.empty:
            remaining_primary = primary_pool  # fallback if all have been selected
        if len(remaining_primary) >= primary_count:
            primary_selected = remaining_primary.sample(n=primary_count)
        else:
            primary_selected = remaining_primary.sample(n=primary_count, replace=True)
        selected_exercises.append(primary_selected)

        # Fill the secondary count from secondary pool, excluding duplicates
        already_selected = pd.concat(selected_exercises).index if selected_exercises else pd.Index([])
        remaining_secondary = secondary_pool.drop(index=already_selected, errors='ignore')
        if remaining_secondary.empty:
            remaining_secondary = secondary_pool  # fallback if empty after exclusion
        if len(remaining_secondary) >= secondary_count:
            secondary_selected = remaining_secondary.sample(n=secondary_count)
        else:
            secondary_selected = secondary_pool.sample(n=secondary_count, replace=True)
        selected_exercises.append(secondary_selected)

        # Combine selections and ensure we have the required number of exercises
        daily_exercises = pd.concat(selected_exercises).drop_duplicates().head(exercises_per_day)
        workout_plan[f'Day {day}'] = [{
            'Exercise': row['Title'],
            'Type': row['Type'],
            'BodyPart': row['BodyPart'],
            'Sets': determine_sets(user_data['Level']),
            'Reps': determine_reps(user_data['Level'], row['Type'])
        } for _, row in daily_exercises.iterrows()]

        # Ensure essential body parts are covered (if missing, add one exercise per missing group)
        current_body_parts = {ex['BodyPart'].lower() for ex in workout_plan[f'Day {day}']}
        for bp in essential_body_parts:
            if bp.lower() not in current_body_parts:
                bp_group = merged_df[merged_df['BodyPart'].str.lower() == bp.lower()]
                if not bp_group.empty:
                    extra_ex = bp_group.sample(n=1).iloc[0]
                    workout_plan[f'Day {day}'].append({
                        'Exercise': extra_ex['Title'],
                        'Type': extra_ex['Type'],
                        'BodyPart': extra_ex['BodyPart'],
                        'Sets': determine_sets(user_data['Level']),
                        'Reps': determine_reps(user_data['Level'], extra_ex['Type'])
                    })

    # Ensure at least one cardio and one stretching exercise are included across the week.
    all_exercises = [ex for day in workout_plan for ex in workout_plan[day]]
    types_in_plan = [ex['Type'].lower() for ex in all_exercises]

    if "cardio" not in types_in_plan:
        cardio_ex = merged_df[merged_df['Type'].str.lower() == "cardio"]
        if not cardio_ex.empty:
            replacement = cardio_ex.sample(n=1).iloc[0]
            random_day = random.choice(list(workout_plan.keys()))
            workout_plan[random_day].insert(0, {
                'Exercise': replacement['Title'],
                'Type': replacement['Type'],
                'BodyPart': replacement['BodyPart'],
                'Sets': determine_sets(user_data['Level']),
                'Reps': determine_reps(user_data['Level'], replacement['Type'])
            })

    if "stretching" not in types_in_plan:
        stretch_ex = merged_df[merged_df['Type'].str.lower() == "stretching"]
        if not stretch_ex.empty:
            random_day = random.choice(list(workout_plan.keys()))
            sampled = stretch_ex.sample(n=1).iloc[0]
            workout_plan[random_day].insert(1, {
                'Exercise': sampled['Title'],
                'Type': sampled['Type'],
                'BodyPart': sampled['BodyPart'],
                'Sets': determine_sets(user_data['Level']),
                'Reps': determine_reps(user_data['Level'], sampled['Type'])
            })

    bmi = user_data['Weight (kg)'] / (user_data['Height_m'] ** 2)
    if bmi >= 25 or predicted_focus == "Fat_Loss":
        hiit_ex = merged_df[merged_df['Type'].str.lower().isin(["hiit", "cardio"])]
        if not hiit_ex.empty:
            extra = hiit_ex.sample(n=1).iloc[0]
            # Choose a random day to add the extra HIIT exercise (if that day exists)
            day_key = random.choice(list(workout_plan.keys()))
            workout_plan[day_key].append({
                'Exercise': extra['Title'],
                'Type': extra['Type'],
                'BodyPart': extra['BodyPart'],
                'Sets': determine_sets(user_data['Level']),
                'Reps': determine_reps(user_data['Level'], extra['Type'])
            })
    return workout_plan


# ------------------------------
# Main Function with CLI via argparse
# ------------------------------
def main():
    parser = argparse.ArgumentParser(description="AI-Powered Workout Planner with Advanced ML Integration")
    parser.add_argument('--members_file', type=str, required=True, help="Path to the gym members dataset CSV")
    parser.add_argument('--exercises_file', type=str, required=True, help="Path to the exercises dataset CSV")
    args = parser.parse_args()

    logging.info("Loading and merging datasets...")
    try:
        merged_df, df_members = load_and_merge_datasets(args.members_file, args.exercises_file)
        model = train_fitness_goal_model(df_members)
    except Exception as e:
        logging.error(f"Initialization Error: {e}")
        sys.exit(1)

    print("\nPlease provide your fitness information:")
    try:
        user_data = {
            'Age': get_valid_input("Age: ", int, valid_range=(10, 100)),
            'Gender': input("Gender (Male/Female/Other): ").strip().capitalize(),
            'Level': input("Experience Level (Beginner/Intermediate/Advanced): ").strip().strip('\'"').capitalize(),
            'Weight (kg)': get_valid_input("Weight (kg): ", float, valid_range=(30, 300)),
            'Height_m': get_valid_input("Height (m): ", float, valid_range=(1.0, 2.5)),
            'Resting_BPM': get_valid_input("Resting Heart Rate (BPM): ", int, valid_range=(30, 120)),
            'Fat_Percentage': get_valid_input("Body Fat Percentage: ", float, valid_range=(5, 60)),
            'Water_Intake (liters)': get_valid_input("Daily Water Intake (liters): ", float, valid_range=(0.5, 10)),
            'Workout_Frequency (days/week)': get_valid_input("Current Workout Frequency (days/week): ", int,
                                                             valid_range=(0, 7)),
            'Workout_Days': get_valid_input("Desired Workout Days: ", int, valid_range=(1, 7)),
            'Exercises_Per_Day': get_valid_input("Exercises Per Day: ", int, valid_range=(1, 10))
        }
        preferred_workout = get_valid_option("Preferred workout type? Choose one",
                                             ["Mixed", "Cardio", "HIIT", "Strength", "Plyometrics", "Stretching",
                                              "Powerlifting", "Olympic Weightlifting", "Strongman"])
        allowed_body_parts = [
            "Abdominals", "Adductors", "Abductors", "Biceps", "Calves", "Chest",
            "Forearms", "Glutes", "Hamstrings", "Lats", "Lower Back", "Middle Back",
            "Traps", "Neck", "Quadriceps", "Shoulders", "Triceps", "Full Body"
        ]
        focused_body_parts = get_valid_options("Which body parts would you like to emphasize?", allowed_body_parts)
        if "Full Body" in [bp.capitalize() for bp in focused_body_parts]:
            focused_body_parts = [bp for bp in allowed_body_parts if bp.lower() != "full body"]
    except Exception as e:
        logging.error(f"Error reading input: {e}")
        sys.exit(1)

    bmi = user_data['Weight (kg)'] / (user_data['Height_m'] ** 2)
    print(f"\nYour calculated BMI is: {bmi:.1f}")
    if bmi < 18.5:
        bmi_focus = "Muscle_Gain"
    elif bmi >= 25:
        bmi_focus = "Fat_Loss"
    else:
        bmi_focus = "General_Fitness"
    print(f"Based on your BMI, a default focus of {bmi_focus} is suggested.\n")

    try:
        user_df = pd.DataFrame([user_data])
        prediction = model.predict(user_df)[0]
        probabilities = model.predict_proba(user_df)[0]
        print(f"Predicted Fitness Focus: {prediction}")
        print("Confidence Levels:", {model.classes_[i]: f"{p:.1%}" for i, p in enumerate(probabilities)})
        focus_override = get_valid_option(
            "Would you like to focus on building muscle or fat loss? (Enter 'Muscle' or 'Fat' or 'None')",
            ["Muscle", "Fat", "None"])
        if focus_override != "None":
            if focus_override == "Muscle":
                prediction = "Muscle_Gain"
            elif focus_override == "Fat":
                prediction = "Fat_Loss"
            print(f"\nOverriding focus: now focusing on {prediction}")

        if preferred_workout == "Mixed":
            expanded_focus_exercise_mapping = {
                'Fat_Loss': ['HIIT', 'Cardio', 'Strength', 'Plyometrics', 'Stretching'],
                'Muscle_Gain': ['Strength', 'Powerlifting', 'Olympic Weightlifting', 'Strongman', 'Plyometrics'],
                'General_Fitness': ['Cardio', 'Strength', 'Stretching', 'Flexibility', 'Balance'],
                'Weight_Loss': ['HIIT', 'Cardio', 'Plyometrics', 'Strength', 'Circuit Training']
            }
            recommended_types = expanded_focus_exercise_mapping.get(prediction, ['Cardio', 'Strength', 'Stretching'])
            print("\nBased on your profile, we recommend the following workout type(s):",
                  ", ".join(recommended_types))
        else:
            print(
                f"\nBased on your preference, we will primarily use {preferred_workout} workouts (with a few variations) in your plan.")
    except Exception as e:
        logging.error(f"Prediction Error: {e}")
        sys.exit(1)

    workout_plan = generate_ml_workout_plan(user_data, merged_df, prediction,
                                            preferred_workout if preferred_workout != "Mixed" else None,
                                            focused_body_parts)
    print("\nAI-Generated Workout Plan:")
    for day, exercises in workout_plan.items():
        print(f"\n{day}:")
        for ex in exercises:
            print(f"  {ex['Exercise']} ({ex['Type']})")
            print(f"    Body Part: {ex['BodyPart']}")
            print(f"    Prescription: {ex['Sets']} x {ex['Reps']} reps\n")


if __name__ == '__main__':
    main()
