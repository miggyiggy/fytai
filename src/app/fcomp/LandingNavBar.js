"use client";

import React, { useState } from "react";
import styled from "styled-components";
import RegistrationForm from "../fcomp/Registration";
import Login from "../fcomp/Login";

// ✅ Black Navbar Container
const NavBarContainer = styled.nav`
  background-color: black;
  color: gold;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2rem 4rem;
  position: relative;
  height: 8rem;
  margin-bottom: 0;
  z-index: 1000;
`;

// ✅ Logo Design
const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  font-family: "Arial", cursive;
  font-size: 3.5rem;
  color: white;
`;

// ✅ Emblem Background (Restored)
const EmblemBackground = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #d9d9d9;
  width: 15rem;
  height: 8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1002;
`;

// ✅ Emblem Logo
const EmblemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 7rem;
  height: 7rem;
`;

const Emblem = styled.img`
  width: 100%;
  height: auto;
`;

// ✅ Buttons (Sign In / Register)
const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
`;

const NavButton = styled.button`
  background-color: black;
  color: white;
  font-weight: bold;
  padding: 0.8rem 2rem;
  font-size: 1.2rem;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background-color: #366477;
  }
`;


// ✅ Blurred Overlay (Applies blur when a form is active)
const BlurOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);  /* Dark overlay */
  backdrop-filter: blur(10px);  /* ✅ Blurs everything */
  z-index: 1000;  /* ✅ Below the pop-up but above the content */
`;

// ✅ Popup Container (Ensures form is above the overlay)
const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: transparent;
  padding: 0;
  text-align: center;
  z-index: 1001;  /* ✅ Ensure it's above the blur */
  border: none;
  width: auto;
`;

// ✅ Close Button (Fixed Visibility + Better Positioning)
const CloseButton = styled.button`
  position: absolute;
  top: -15px;
  right: -15px;
  background: black;
  color: white;
  border: 2px solid white;
  font-size: 16px;
  font-weight: bold;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  z-index: 1002;
  transition: background 0.2s;

  &:hover {
    background: red;
  }
`;

const WelcomeNavBar = () => {
  const [activeForm, setActiveForm] = useState(null);

  const toggleForm = (formType) => {
    setActiveForm((prevForm) => (prevForm === formType ? null : formType));
  };

  return (
    <>
      {/* ✅ Black Navbar */}
      <NavBarContainer>
        <LogoContainer>FytAI</LogoContainer>
        
        <ButtonContainer>
          <NavButton onClick={() => toggleForm("login")}>Log In</NavButton>
          <NavButton onClick={() => toggleForm("register")}>Register</NavButton>
        </ButtonContainer>
      </NavBarContainer>

      {/* ✅ Blurred Background when Popup is Active */}
      {activeForm && <BlurOverlay onClick={() => setActiveForm(null)} />}

      {/* ✅ Popup Forms (Now with Close Button) */}
      {activeForm && (
        <ModalContainer>
          <CloseButton onClick={() => setActiveForm(null)}>X</CloseButton>
          
          {activeForm === "register" && <RegistrationForm />}
          {activeForm === "login" && <Login />}
        </ModalContainer>
      )}
    </>
  );
};

export default WelcomeNavBar;