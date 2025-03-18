"use client";

import React, {useState, useEffect} from "react";
import Image from "next/image";
import NavBar from "../fcomp/NavigationBar";
import PersonalIcon from "../fcomp/PersonalIcon";
import styled from "styled-components";

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

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

export default function Home() {
  const [showImage, setShowImage] = useState(true);

    useEffect(() => {
        // Simulating some logic that changes the state after a short delay
        setTimeout(() => {
            setShowImage(false);
        }, 2000); // 2 seconds delay
    }, []);

  return (
    <PageContainer>
      <NavBar />
      <ContentContainer>
        <ImageContainer>
         <div>
            {showImage && (
                <Image 
                    src="/FyTAI Page 2.jpg" 
                    alt="Background Image"
                    layout="fill"
                    objectFit="cover"
                />
            )}
        </div>
        </ImageContainer>
      </ContentContainer>
    </PageContainer>
  );
}

