import React, {useState} from "react";
import Button from "./GeneralButtons";
import GeneralButton from "./GeneralButtons";
import styled from "styled-components";

const Container = styled.div`
    width: 900px;
    height:700px;
    background: #a2a5a8;
    padding: 5px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 3px solid #f4f4f4;
`;

const Title = styled.div`
    display: flex;
    align-items: center;
    font-size: 25px;
    font-weight: bold;
    color: #131415;
`;

const ButtonContainer = styled.div`
    display: flex;
    align-items: right;
    justify-content: center;
    width: 100%;
    margin-bottom: 20px;
`;

const FromContainer = styled.div`
    display: flex;
    gap: 80px;
    justify-content: center;
    align-items: flex-start;
    width: 100%
`;

const Column = styled.div`
    gap: 20px;
    flex-direction: flex;
    display: flex;
`;

const InputField = styled.input`
    width: 300px;
    height: 60px;
    padding: 10px;
    font-size: 19px;
    border: 2px solid white;
    background: white;
    color: #131415;
`;

const Label = styled.input`
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 3px;
    text-align: left;
    color: #131415;
`;

const RegisterButton = styled(GeneralButton)`
    width: 350px;
    margin-top: 30px;

    &:hover{
        bakground-color: #366477;
    }
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 14px;
  margin-top: -10px; /* Adjust as needed to position error message */
  margin-bottom: 10px;
`;

function RegisterPersonal(){
    const [formData, setFormData] = useState({
        Name: "",
        age: "",
        sex: "",
        contactNumber: "",
        email: "",
        height: "",
        weight: "",
        bodyMass: "",
      });

      //backend, for error handling
      const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.Name.trim()) newErrors.Name = "Name is required";
    if (!formData.age.trim()) newErrors.age = "age is required";
    if (!formData.contactNumber.trim())
      newErrors.contactNumber = "Contact Number is required";
    if (!formData.sex.trim()) newErrors.sex = "sex is required";
    if (!formData.email.trim()) newErrors.email = "Email Address is required";
    if (!formData.height.trim()) newErrors.height = "height is required";
    if (!formData.weight.trim()) newErrors.weight = "weight is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const { confirmPassword, ...dataToSend } = formData;
        const response = await fetch("http://localhost:8000/register/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        });

        if (response.ok) {
          alert("Registration Successful!");
          console.log("User Data:", formData);
        } else {
          const errorData = await response.json();
          alert(`Registration failed: ${errorData.error || "Unknown error"}`);
        }
      } catch (error) {
        console.error("Error during registration:", error);
        alert("An error occurred during registration.");
      }
    }
  };

      return (
        <Container>
          <Title style={{ fontFamily: "Segoe UI Variable, sans-serif" }}>
            REGISTER
          </Title>
          <form onSubmit={handleSubmit}>
            <InputGroup>
              <StyledLabel>Name</StyledLabel>
              <LInput
                type="text"
                name="Name"
                value={formData.Name}
                onChange={handleChange}
              />
              {errors.Name && <ErrorText>{errors.Name}</ErrorText>}
            </InputGroup>
    
            <InputGroup>
              <StyledLabel>Age</StyledLabel>
              <LInput
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
              />
              {errors.Name && <ErrorText>{errors.age}</ErrorText>}
            </InputGroup>
    
            <InputGroup>
              <StyledLabel>Contact Number</StyledLabel>
              <LInput
                type="number"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
              />
              {errors.contactNumber && (
                <ErrorText>{errors.contactNumber}</ErrorText>
              )}
            </InputGroup>
  
            <InputGroup>
              <StyledLabel>Sex</StyledLabel>
              <LInput
                type="text"
                name="sex"
                value={formData.sex}
                onChange={handleChange}
              />
              {errors.sex && <ErrorText>{errors.sex}</ErrorText>}
            </InputGroup>
    
            <InputGroup>
              <StyledLabel>Email Address</StyledLabel>
              <LInput
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              {errors.email && <ErrorText>{errors.email}</ErrorText>}
            </InputGroup>
    
            <InputGroup>
              <StyledLabel>Height</StyledLabel>
              <LInput
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
              />
              {errors.height && <ErrorText>{errors.height}</ErrorText>}
            </InputGroup>
    
            <InputGroup>
              <StyledLabel>Weight</StyledLabel>
              <LInput
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
              />
              {errors.weight && (
                <ErrorText>{errors.weight}</ErrorText>
              )}
            </InputGroup>

                
            <InputGroup>
              <StyledLabel>Body Mass Index</StyledLabel>
              <LInput
                type="number"
                name="bodyMass"
                value={formData.bodyMass}
                onChange={handleChange}
              />
              {errors.bodyMass && <ErrorText>{errors.bodyMass}</ErrorText>}
            </InputGroup>
    
            <Button type="submit">Register</Button>
          </form>
        </Container>
      );
}

export default RegisterPersonal;