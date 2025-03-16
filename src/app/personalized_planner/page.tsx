"use client";
import React from "react";
import styled from "styled-components";
import NavBar from "../fcomp/NavigationBar";
import PersonalizedPlan from "../fcomp/PersonalizedPlan";

const PageContainer = styled.div`
    background: #131415;
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

const PersonalizedPlanner = () => {
    return(
        <PageContainer>
            <NavBar />
            <ContentContainer>
                <PersonalizedPlan />
            </ContentContainer>
        </PageContainer>
    )
}

export default PersonalizedPlanner;
