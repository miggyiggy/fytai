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

  return (
    <PageContainer>
      <NavBar />
      <ContentContainer>
        <ImageContainer>
         <div>
            {showImage && (
                <Image 
                    src="/Images/FytAI Page 2.jpg" 
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

