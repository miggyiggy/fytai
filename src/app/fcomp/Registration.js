import React, { useState } from "react";
import styled from "styled-components";
import SignButton from "../fcomp/SignButton";

const FormContainer = styled.div`
  width: 700px;
  height: auto;
  background: #a2a5a8;
  border-radius: 20px;
  border: 5px solid #f4f4f5;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h2`
  color: black;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
  font-size: 30px;
`;

const InputGroup = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 5px;
`;

const StyledLabel = styled.label`
  color: black;
  font-weight: bold;
  align-self: flex-start;
  margin-left: 30px;
  margin-bottom: 5px;
  text-align: center;
`;

const LInput = styled.input`
  color: white;
  padding: 10px;
  margin-top: 5px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 16px;
  width: 300px;
  box-sizing: border-box;
  background-color: white;

  &:focus {
    border-color:rgb(12, 12, 12);
    outline: none;
    box-shadow: 0 0 5px rgba(252, 252, 252, 0.77);
  }
`;

const ErrorText = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 5px;
`;

function Registration() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [usernameError, setUsernameError] = useState(false);
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
    setUsernameError(false);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
    setEmailError(false);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
    setPasswordError(false);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    setConfirmPasswordError(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Reset error states
    setUsernameError(false);
    setEmailError(false);
    setPasswordError(false);
    setConfirmPasswordError(false);

    // Validation
    if (!username) {
        setUsernameError(true);
    }
    if (!email) {
        setEmailError(true);
    }
    if (!password) {
        setPasswordError(true);
     }
    if (!confirmPassword) {
        setConfirmPasswordError(true);
    }
    if (password !== confirmPassword) {
        setConfirmPasswordError(true);
    }

    // No API call or data collection here

    // You can add a success message or redirect if needed
    if (username && email && password && confirmPassword && password === confirmPassword) {
        console.log("Registration successful!"); 
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
     <Title>Register</Title>
      {/* Username */}
      <InputGroup htmlFor="username">Username:</InputGroup>
      <LInput
        type="text"
        id="username"
        value={username}
        onChange={handleUsernameChange}
      />
      {usernameError && <ErrorM>Username is required</ErrorM>}

      {/* Email */}
      <InputGroup htmlFor="email">Email:</InputGroup>
      <LInput
        type="email"
        id="email"
        value={email}
        onChange={handleEmailChange}
      />
      {emailError && <ErrorM>Email is required</ErrorM>}

      {/* Password */}
      <InputGroup htmlFor="password">Password:</InputGroup>
      <LInput
        type="password"
        id="password"
        value={password}
        onChange={handlePasswordChange}
      />
      {passwordError && <ErrorM>Password is required</ErrorM>}

      {/* Confirm Password */}
      <InputGroup htmlFor="confirmPassword">Confirm Password:</InputGroup>
      <LInput
        type="password"
        id="confirmPassword"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
      />
      {confirmPasswordError && <ErrorM>Passwords do not match</ErrorM>}

      {/* Create Button */}
      <center>
        <SignButton type="submit" disabled={!username || !email || !password || !confirmPassword || password !== confirmPassword}>
          Create
        </SignButton>
      </center>
    </FormContainer>
  );
}

export default Registration;