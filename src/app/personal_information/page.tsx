// personal_info.js (or whatever you name the file)

"use client";
import React from 'react';
import NavigationBar from '../fcomp/NavigationBar'; // Adjust the import path
import RegisterPersonalInfo from '../fcomp/RegisterPersonalInfo'; // Adjust the import path
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
        <RegisterPersonalInfo />
      </ContentContainer>
    </PageContainer>
  );
};

export default PersonalInfoPage;