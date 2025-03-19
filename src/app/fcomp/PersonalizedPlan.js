"use client";

import React, { useState } from "react";
import styled from "styled-components";
import { useRouter } from 'next/navigation'; // Import useRouter

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

const Submitbutton = styled.button`
  background-color: #f4f4f5;
  color:black;
  transition: background-color 0.3s ease;
  padding: 15px 15px;
  cursor: pointer;
  text-align: center:


  &:hover{
    background-color:#366477;
  }
`;

function PersonalizedPlan() {
    const router = useRouter(); // Initialize useRouter
    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [bodyPart, setBodyPart] = useState("");
    const [level, setLevel] = useState("beginner");
    const [daysPerWeek, setDaysPerWeek] = useState("");
    const [weightError, setWeightError] = useState("");
    const [heightError, setHeightError] = useState("");

    const handleSubmit = async (event) => {
        event.preventDefault();

        let hasErrors = false;
        if (!weight) { setWeightError("Weight is required"); hasErrors = true; }
        if (!height) { setHeightError("Height is required"); hasErrors = true; }
        if (!bodyPart || !level || !daysPerWeek) { hasErrors = true; }

        if (hasErrors) return;

        // Redirect to recommendations page with form data as query parameters
        router.push(`/AIRecommendations?weight=${weight}&height=${height}&bodyPart=${bodyPart}&level=${level}&daysPerWeek=${daysPerWeek}`);
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
                    <StyledLabel htmlFor="bodyPart">Muscle Group:</StyledLabel>
                    <LInput
                        type="text"
                        id="bodyPart"
                        placeholder="Chest, Legs, Arms, etc."
                        value={bodyPart}
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
                        <option value="expert">Expert</option>
                    </LSelect>
                </InputGroup>

                <InputGroup>
                    <StyledLabel htmlFor="daysPerWeek">Days per Week:</StyledLabel>
                    <LInput
                        type="number"
                        id="daysPerWeek"
                        placeholder="3"
                        value={daysPerWeek}
                        onChange={(e) => setDaysPerWeek(e.target.value)}
                    />
                </InputGroup>

                <center>
                    <Submitbutton type="submit">Generate</Submitbutton>
                </center>
            </form>
        </FormContainer>
    );
}

export default PersonalizedPlan;