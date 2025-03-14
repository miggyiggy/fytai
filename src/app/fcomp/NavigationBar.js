"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import PersonalIcon from '../fcomp/PersonalIcon'; // Import the PersonalIcon component

const NavBarContainer = styled.nav`
  background-color: black;
  color: white;
  display: flex;
  align-items: center;
  padding: 1rem;
  justify-content: space-between;
`;

const NavItems = styled.div`
  display: flex;
  align-items: center;
  jsutify-content: center;
`;

const CenterNavItems = styled.div`
  display: flex;
  justify-content: center;
  flex-grow: 1;
`;

const NavItem = styled.a`
  color: white;
  text-decoration: none;
  margin: 0 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;

  &:hover {
    background-color: #366477;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled.span`
  font-weight: bold;
  font-size: 1.2rem;
  margin-right: 2rem;
`;

const EmblemContainer = styled.div`
  background-color: #000000;
  border-radius: 50%;
  padding: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
`;

const Emblem = styled.img`
  max-width: 100%;
  height: auto;
`;

const NavBar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role);
    }
    console.log("NavBar useEffect:", isLoggedIn, userRole);
  },[]);
    console.log("NavBar rendering:", isLoggedIn, userRole);

  return (
    <NavBarContainer>
      <LogoContainer>
        <EmblemContainer>
          <Emblem src="/FytAI New Logo.png" alt="Emblem" />
        </EmblemContainer>
        <Logo>FytAI</Logo>
      </LogoContainer>

      <NavItems>
          <CenterNavItems>
            <>
              <Link href="/home_page">
                <NavItem>Home</NavItem>
              </Link>
              <Link href="/workout_planner">
                <NavItem>AI Workout Planner</NavItem>
              </Link>
              <Link href="/progress_&_analytics">
                <NavItem>Progress & Analytics</NavItem>
              </Link>
            </>
          </CenterNavItems>
        <PersonalIcon /> {/* Include the PersonalIcon component */}
      </NavItems>
    </NavBarContainer>
  );
};

export default NavBar;