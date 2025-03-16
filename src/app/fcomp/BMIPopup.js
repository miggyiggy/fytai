import React from 'react';
import styled from 'styled-components';

const PopupContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border: 1px solid #ccc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
`;

const BMIPopup = ({ bmi, fitnessGoal, onClose }) => {
  return (
    <PopupContainer>
      <CloseButton onClick={onClose}>X</CloseButton>
      <p>Your BMI is: {bmi.toFixed(2)}</p>
      <p>Your fitness goal is: {fitnessGoal}</p>
    </PopupContainer>
  );
};

export default BMIPopup;