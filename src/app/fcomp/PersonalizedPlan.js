import React, { useState } from "react";
import styled from "styled-components";
import SignButton from "./SignButton";
import BMIPopup from "../fcomp/BMIPopup"

const FormContainer = styled.div`
  width: 700px;
  height: auto;
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
  margin-bottom: 5px;
`;

const StyledLabel = styled.label`
  color: black;
  font-weight: bold;
  align-self: flex-start;
  margin-left: 30px;
  margin-bottom: 5px;
  text-align: center;
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
  box-sizing: border-box;
  background-color: white;

  &:focus {
    border-color: rgb(12, 12, 12);
    outline: none;
    box-shadow: 0 0 5px rgba(252, 252, 252, 0.77);
  }
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
  box-sizing: border-box;
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
  const [level, setLevel] = useState("beginner"); // Default to beginner
  const [weightError, setWeightError] = useState("");
  const [heightError, setHeightError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [bmi, setBmi] = useState(0);
  const [fitnessGoal, setFitnessGoal] = useState("");

  const handleWeightChange = (e) => {
    const value = e.target.value;
    const weightValue = parseFloat(value);
    if (!/^\d*\.?\d*$/.test(value)) {
      setWeightError("Weight must be a number");
    } else if (weightValue < 20 || weightValue > 200) {
      setWeightError("Weight must be between 20 and 200 kg");
    } else {
      setWeightError("");
    }
    setWeight(value);
  };

  const handleHeightChange = (e) => {
    const value = e.target.value;
    const heightValue = parseFloat(value);
    if (!/^\d*\.?\d*$/.test(value)) {
      setHeightError("Height must be a number");
    } else if (heightValue < 1.0 || heightValue > 2.5) {
      setHeightError("Height must be between 1.0 and 2.5 meters");
    } else {
      setHeightError("");
    }
    setHeight(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Basic validation
    let hasErrors = false;
    if (!weight) {
      setWeightError("Weight is required");
      hasErrors = true;
    }
    if (!height) {
      setHeightError("Height is required");
      hasErrors = true;
    }
    if (!gender) {
      // Add error state for gender if needed
      hasErrors = true;
    }
    if (!body_part) {
      // Add error state for body part if needed
      hasErrors = true;
    }
    if (!level) {
      // Add error state for level if needed
      hasErrors = true;
    }

    if (!hasErrors) {
      console.log("Form submitted:", {
        weight,
        height,
        gender,
        body_part,
        level,
      });
      // Add your API call or data collection here
    }

    if (!hasErrors) {
        const calculatedBMI = calculateBMI(weight, height);
        const calculatedFitnessGoal = getFitnessGoal(calculatedBMI, gender);
  
        setBmi(calculatedBMI);
        setFitnessGoal(calculatedFitnessGoal);
        setShowPopup(true);
      }
    
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <Title>Generate Personalized Workout</Title>

      <InputGroup htmlFor="weight">Weight (kg):</InputGroup>
      <LInput
        type="text"
        id="weight"
        value={weight}
        onChange={handleWeightChange}
      />
      {weightError && <ErrorText>{weightError}</ErrorText>}

      <InputGroup htmlFor="height">Height (m):</InputGroup>
      <LInput
        type="text"
        id="height"
        value={height}
        onChange={handleHeightChange}
      />
      {heightError && <ErrorText>{heightError}</ErrorText>}

      <InputGroup htmlFor="gender">Gender (M/F):</InputGroup>
      <LInput
        type="text"
        id="gender"
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      />

      <InputGroup htmlFor="body_part">Body Part:</InputGroup>
      <LInput
        type="text"
        id="body_part"
        placeholder="Chest, Legs, Arms, etc."
        value={body_part}
        onChange={(e) => setBodyPart(e.target.value)}
      />

      <InputGroup htmlFor="level">Level:</InputGroup>
      <LSelect
        id="level"
        value={level}
        onChange={(e) => setLevel(e.target.value)}
      >
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </LSelect>

      <center>
        <SignButton type="submit">Generate</SignButton>
      </center>
      
      {showPopup && (
        <BMIPopup
          bmi={bmi}
          fitnessGoal={fitnessGoal}
          onClose={closePopup}
        />
      )}
    </FormContainer>
  );
}

export default PersonalizedPlan;