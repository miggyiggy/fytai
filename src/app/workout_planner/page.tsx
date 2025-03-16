"use client";
import React from "react";
import styled from "styled-components";
import NavBar from "../fcomp/NavigationBar";
import Link from "next/link"; // Import Link

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const ContentContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const SectionLink = styled(Link)`
  font-size: 1.5rem;
  margin-bottom: 30px;
  text-decoration: none;
  color: #333; /* Or your preferred color */

  &:hover {
    text-decoration: underline;
  }
`;

const WorkoutPlanner = () => {
  return (
    <PageContainer>
      <NavBar />
      <ContentContainer>
        <SectionLink href="/personalized_planner">Generate Personalized Plan</SectionLink>
        <SectionLink href="/customization">Customization</SectionLink>
        <SectionLink href="/AI_recommendation">AI Recommendations</SectionLink>
      </ContentContainer>
    </PageContainer>
  );
};

export default WorkoutPlanner;