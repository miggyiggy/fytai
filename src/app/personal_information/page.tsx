// personal_info.js (or whatever you name the file)

"use client";
import React from 'react';
import NavigationBar from '../fcomp/NavigationBar'; // Adjust the import path
import RegisterPersonalInfo from '../fcomp/RegisterPersonal'; // Adjust the import path
import PersonalInformation from '../fcomp/PersonalInformation';
import FitnessDetails from '../fcomp/FitnessDetails';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const PersonalInfoPage = () => {
  return (
    <PageContainer>
      <NavigationBar />
      <ContentContainer>
        <PersonalInformation />
        <FitnessDetails />
      </ContentContainer>
    </PageContainer>
  );
};

export default PersonalInfoPage;