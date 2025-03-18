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

const FitnessDetails = ({ bmi, fitnessGoal, height, weight }) => {
  return (
      <FitnessDetailsContainer>
          <Title>Fitness Details</Title>
          <Content>
              <Column>
                  <Label>Body Mass Index:</Label>
                  <Value>{bmi ? bmi.toFixed(2) : 'N/A'}</Value>

                  <Label>Height:</Label>
                  <Value>{height ? `${height} m` : 'N/A'}</Value>

                  <Label>Weight:</Label>
                  <Value>{weight ? `${weight} kg` : 'N/A'}</Value>
              </Column>

              <Column>
                  <Label>Fitness Goal:</Label>
                  <Value>{fitnessGoal || 'N/A'}</Value>
              </Column>
          </Content>
      </FitnessDetailsContainer>
  );
};

export default FitnessDetails;