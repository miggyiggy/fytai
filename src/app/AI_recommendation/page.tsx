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
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const AIRecommendation = () => {
    return(
        <PageContainer>
            <NavBar />
        </PageContainer>
    )
}

export default AIRecommendation;