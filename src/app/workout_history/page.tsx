"use client";
import React from "react";
import styled from "styled-components";
import NavBar from "../fcomp/NavigationBar";

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

const WorkoutHistory = () => {
    return(
        <PageContainer>
            <NavBar />
        </PageContainer>
    )
}