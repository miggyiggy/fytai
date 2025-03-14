import React from 'react';
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

      {/* Add more rows as needed */}
    </PersonalInfoContainer>
  );
};

export default PersonalInformation;