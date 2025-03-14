import React from 'react';
import styled from 'styled-components';

const FitnessDetailsContainer = styled.div`
  width: 500px; /* Adjust as needed */
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const Content = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
`;

const Column = styled.div`
  /* Styles for each column */
`;

const Label = styled.span`
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
`;

const Value = styled.div`
  /* Styles for the value area */
`;

const FitnessLevelValue = styled(Value)`
  background-color: #f08080; /* Light red */
  padding: 10px;
  border-radius: 5px;
  text-align: center;
`;

const FitnessDetails = () => {
  return (
    <FitnessDetailsContainer>
      <Title>Fitness Details</Title>
      <Content>
        <Column>
          <Label>Body Mass Index:</Label>
          <Value>25</Value> {/* Replace with actual data */}

          <Label>Height:</Label>
          <Value>175 cm</Value> {/* Replace with actual data */}

          <Label>Weight:</Label>
          <Value>75 kg</Value> {/* Replace with actual data */}
        </Column>

        <Column>
          <Label>Fitness Level:</Label>
          <FitnessLevelValue>Moderate</FitnessLevelValue>
        </Column>
      </Content>
    </FitnessDetailsContainer>
  );
};

export default FitnessDetails;