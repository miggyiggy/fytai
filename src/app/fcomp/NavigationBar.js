"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import styled from "styled-components";

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
`;

const NavItem = styled.a`
  color: white;
  text-decoration: none;
  margin: 0 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;

  &:hover {
    background-color: rgba(0, 89, 255, 0.2);
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
  background-color: #e0e0e0;
  border-radius: 50%;
  padding: 0.5rem;
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

const LogoutButton = styled.button`
  background-color: white;
  color: black;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 1rem;
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
  }, []);

  console.log("NavBar rendering:", isLoggedIn, userRole);

  // if (!isLoggedIn) {
  //   return null; // Temporarily commented out
  // }

  return (
    <NavBarContainer>
      <LogoContainer>
        <EmblemContainer>
          <Emblem src="/images/emblem.png" alt="Emblem" />
        </EmblemContainer>
        <Logo>FytAI</Logo>
      </LogoContainer>

      <NavItems>
        {userRole === "admin" ? (
          <>
            <Link href="/admin/dashboard">
              <NavItem>Dashboard</NavItem>
            </Link>
            <Link href="/admin/users">
              <NavItem>Users</NavItem>
            </Link>
          </>
        ) : (
          <>
            <Link href="/homepage">
              <NavItem>Home</NavItem>
            </Link>
            <Link href="/profile_management">
              <NavItem>Profile Management</NavItem>
            </Link>
            <Link href="/AI_workout_planner">
              <NavItem>AI Workout Planner</NavItem>
            </Link>
            <Link href="/progress_track_&_analytics">
              <NavItem>Progress Track & Analytics</NavItem>
            </Link>
            <Link href="/help&support">
              <NavItem>Help & Support</NavItem>
            </Link>
          </>
        )}
        <LogoutButton
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            setIsLoggedIn(false);
            setUserRole(null);
            window.location.href = "/";
          }}
        >
          Logout
        </LogoutButton>
      </NavItems>
    </NavBarContainer>
  );
};

export default NavBar;