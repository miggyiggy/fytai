"use client";
import React from "react";
import styled from "styled-components";
import NavigationBar from "../fcomp/NavigationBar";
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
  margin-bottom: 20px;
  text-decoration: none;
  color: #333; /* Or your preferred color */

  &:hover {
    text-decoration: underline;
  }
`;

const HelpSupport = () => {
  return (
    <PageContainer>
      <NavigationBar />
      <ContentContainer>
        <SectionLink href="/faq_page">FAQs</SectionLink>
        <SectionLink href="/performance-metrics">Performance Metrics</SectionLink>
        <SectionLink href="/goal_setting">Goal Setting & Achievements</SectionLink>
      </ContentContainer>
    </PageContainer>
  );
};

export default HelpSupport;