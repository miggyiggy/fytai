"use-client";
import React, {useState} from "react";
import styled from "styled-components";

const LoginForm = styled.form`
    padding: 15px;
    margin: 15px;
    background: #a2a5a8;
    border: 3px solid #000000;
    width: 400px;
    height: 400px;
    display: flex;
    flex-direction: column;
`;

const LoginInput = styled.input`
    color: black;
    padding: 10px;
    margin-top: 15px;
    margin-bottom: 30px;
    border: 1px solid #fff;
    font-size: 16px;
    width: 100%;
    box-sizing: border-box;
    background-color: white;
`;

const Title = styled.h2`
    color: black;
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
`;

const Label = styled.label`
    margin-right: 300px;
    color: black;
    font-weight: bold;
`;

const ErrorM = styled.p`
    color: red;
    margin-top: 5px;
    font-size: 14px;
`;

function Login(){

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [loginError, setLoginError] = useState("");

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setEmailError(false); // Clear error on input change
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setPasswordError(false); // Clear error on input change
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Basic validation: Check if email and password are not empty
        if (!email) {
            setEmailError(true);
        }
        if (!password) {
            setPasswordError(true);
        }

        if (email && password) {
            // Placeholder for future API call
            console.log("Email:", email);
            console.log("Password:", password);
            // Here you would typically make an API call to your backend
        }
    };

    return (
        <LoginForm onSubmit={handleSubmit}>
            <Title>LOGIN</Title>
            <Label htmlFor="email">Email</Label>
            <LoginInput
                type="text"
                id="email"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
                required={true}
                aria-invalid={emailError}
            />
            {emailError && <ErrorM>{errorMessage || "This field is required"}</ErrorM>}

            <Label htmlFor="password">Password</Label>
            <LoginInput
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                required={true}
                aria-invalid={passwordError}
            />
            {passwordError && <ErrorM>{errorMessage || "This field is required"}</ErrorM>}

            {loginError && <ErrorM>{loginError}</ErrorM>}

            <center>
                <button
                    type="submit"
                    style={{
                        fontSize: "20px",
                        color: "#131415",
                        width: "155px",
                        height: "35px",
                        border: "2px solid #131415",
                        borderRadius: "20px",
                        transition: "background-color 0.3s",
                        backgroundColor: "white",
                        cursor: "pointer",
                    }}
                    onMouseOver={(e) => (e.target.style.backgroundColor = "#366477")}
                    onMouseOut={(e) => (e.target.style.backgroundColor = "white")}
                >
                    Login
                </button>
            </center>
        </LoginForm>
    );
}

export default Login;

