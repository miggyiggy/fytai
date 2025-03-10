"use client";
import React, { useState } from 'react';
import styled from 'styled-components';

const IconContainer = styled.div`
  position: relative;
  display: inline-block;
  cursor: pointer;
`;

const IconImage = styled.img`
  width: 30px;
  height: 30px;
  border-radius: 50%;
`;

const Modal = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 10;
  display: ${props => props.show === 'true' ? 'block' : 'none'};
`;

const ModalItem = styled.a`
  display: block;
  padding: 10px 15px;
  text-decoration: none;
  color: #333;

  &:hover {
    background-color: #366477;
  }
`;

const LogoutButton = styled.button`
  display: block;
  width: 100%;
  padding: 10px 15px;
  border: none;
  background-color: #fff;
  color: #333;
  cursor: pointer;

  &:hover {
    background-color: #f00;
  }
`;

const PersonalIcon = () => {
  const [showModal, setShowModal] = useState(false);

  const handleIconClick = () => {
    setShowModal(!showModal);
  };

  const handleLogout = () => {
    // Perform logout logic here (e.g., clear local storage, redirect)
    console.log("Logout clicked");
  };

  return (
    <IconContainer>
      <IconImage src="/public/icon.png" alt="Personal Icon" onClick={handleIconClick} />
      <Modal show={showModal}>
        <ModalItem href="/personal-info">Personal Information</ModalItem>
        <ModalItem href="/help-support">Help & Support</ModalItem>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Modal>
    </IconContainer>
  );
};

export default PersonalIcon;