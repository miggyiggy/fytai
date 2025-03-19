import React, { useState } from "react";
import styled from "styled-components";
import SignButton from "../fcomp/SignButton";
import BMIPopup from "../fcomp/BMIPopup";

const FormContainer = styled.div`
  width: 700px;
  background: #a2a5a8;
  border: 5px solid #f4f4f5;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h2`
  color: black;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  font-size: 30px;
`;

const InputGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
`;

const StyledLabel = styled.label`
  color: black;
  font-weight: bold;
  align-self: flex-start;
  margin-left: 30px;
`;

const LInput = styled.input`
  color: black;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 16px;
  width: 300px;
  background-color: white;
`;

const LSelect = styled.select`
  color: black;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 16px;
  width: 300px;
  background-color: white;
`;

const ErrorText = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 5px;
`;

function PersonalizedPlan() {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [body_part, setBodyPart] = useState("");
  const [level, setLevel] = useState("beginner");
  const [weightError, setWeightError] = useState("");
  const [heightError, setHeightError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [calculatedBmi, setCalculatedBmi] = useState(null);
  const [calculatedFitnessGoal, setCalculatedFitnessGoal] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("handleSubmit called!");

    let hasErrors = false;
    if (!weight) { setWeightError("Weight is required"); hasErrors = true; }
    if (!height) { setHeightError("Height is required"); hasErrors = true; }
    if (!gender || !body_part || !level) { hasErrors = true; }

    if (hasErrors) return;

    console.log("Form submitted:", { weight, height, gender, body_part, level });

    try {
      const response = await fetch('http://localhost:8000/api/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weight, height, gender, body_part, level }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("API Response:", result);
        setCalculatedBmi(result.bmi);
        setCalculatedFitnessGoal(result.fitness_goal);
        setShowPopup(true);
      } else {
        console.error('API Error:', response.statusText);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <FormContainer>
      <Title>Generate Personalized Workout</Title>
      <form onSubmit={handleSubmit}>
        <InputGroup>
          <StyledLabel htmlFor="weight">Weight (kg):</StyledLabel>
          <LInput
            type="text"
            id="weight"
            value={weight}
            placeholder="80"
            onChange={(e) => setWeight(e.target.value)}
          />
          {weightError && <ErrorText>{weightError}</ErrorText>}
        </InputGroup>

        <InputGroup>
          <StyledLabel htmlFor="height">Height (m):</StyledLabel>
          <LInput
            type="text"
            id="height"
            value={height}
            placeholder="1.72"
            onChange={(e) => setHeight(e.target.value)}
          />
          {heightError && <ErrorText>{heightError}</ErrorText>}
        </InputGroup>

        <InputGroup>
          <StyledLabel htmlFor="gender">Gender (Male/Female):</StyledLabel>
          <LInput
            type="text"
            id="gender"
            value={gender}
            placeholder="Male or Female"
            onChange={(e) => setGender(e.target.value)}
          />
        </InputGroup>

        <InputGroup>
          <StyledLabel htmlFor="body_part">Body Part:</StyledLabel>
          <LInput
            type="text"
            id="body_part"
            placeholder="Chest, Legs, Arms, etc."
            value={body_part}
            onChange={(e) => setBodyPart(e.target.value)}
          />
        </InputGroup>

        <InputGroup>
          <StyledLabel htmlFor="level">Level:</StyledLabel>
          <LSelect
            id="level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </LSelect>
        </InputGroup>

        <center>
          <SignButton type="submit">Generate</SignButton>
        </center>
      </form>

      {showPopup && (
        <BMIPopup bmi={calculatedBmi} fitnessGoal={calculatedFitnessGoal} onClose={closePopup} />
      )}
    </FormContainer>
  );
}

export default PersonalizedPlan;
