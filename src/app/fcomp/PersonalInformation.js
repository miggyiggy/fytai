import React, {useState} from 'react';
import styled from 'styled-components';

const PersonalInfoContainer = styled.div`
  width: 500px;  /* Adjust the width as needed */
  margin: 20px auto; /* Center the container */
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color:rgb(207, 152, 152); /* Light background */
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const Label = styled.span`
  font-weight: bold;
`;

const Value = styled.span`
  /* Add styling if needed */
`;

const EditButton = styled.button`
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #3e8e41; /* Darker green on hover */
`;

const InputField = styled.input`
  padding: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 60%; /* Adjust width as needed */
`;

const PersonalInformation = () => {
  return (
    <PersonalInfoContainer>
      <Title>Personal Information</Title>

      <InfoRow>
        <Label>Username:</Label>
        <Value>Myles</Value>
      </InfoRow>

      <InfoRow>
        <Label>Email:</Label>
        <Value>myles@example.com</Value>
      </InfoRow>

      <InfoRow>
        <Label>Sex:</Label>
        <Value>Male</Value>
      </InfoRow>

      <EditButton href="/personal_information">Edit Information</EditButton>

      {/* Add more rows as needed */}
    </PersonalInfoContainer>
  );
};

export default PersonalInformation;