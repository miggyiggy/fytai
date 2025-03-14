"use client";
import React, {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';
import LandingNavBar from "../app/fcomp/LandingNavBar";
import Registration from "../app/fcomp/CreateAccount";

const PageContainer = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const CreateAccountButton = styled.button`
  position: absolute;
  top: 90%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 15px 30px;
  background-color: #0070f3; // Example color
  color: white;
  text-decoration: none;
  border-radius: 5px;
  font-size: 1.2rem;
  z-index: 10; // Ensure the button is on top
  border: none; // Add border: none to remove default button border
  cursor: pointer; // Add cursor: pointer for better UX
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

export default function Home() {
  const [activeForm, setActiveForm] = useState(null);
  
    const toggleForm = (formType) => {
      setActiveForm((prevForm) => (prevForm === formType ? null : formType));
    };
  
  return (
    <PageContainer>
      <LandingNavBar />
        <ImageContainer>
          <Image
            src="/FyTAI (2).jpg" // Replace with your image path
            alt="Background Image"
            layout="fill"
            objectFit="cover"
          />
        </ImageContainer>
        <CreateAccountButton onClick={() => toggleForm("register")}>
          Create Account
        </CreateAccountButton>
        
        {/* ✅ Blurred Background when Popup is Active */}
          {activeForm && <BlurOverlay onClick={() => setActiveForm(null)} />}

      {/* ✅ Popup Forms (Now with Close Button) */}
        {activeForm && (
          <ModalContainer>
            <CloseButton onClick={() => setActiveForm(null)}>X</CloseButton>
    
            {activeForm === "register" && <Registration />}
          </ModalContainer>
        )}
    </PageContainer>
  );
}