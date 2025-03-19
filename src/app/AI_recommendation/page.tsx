"use client";

// AIRecommendations.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const RecommendationsContainer = styled.div`
  width: 80%;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
`;

const RecommendationItem = styled.div`
  margin-bottom: 10px;
`;

const AIRecommendations = () => {
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('/api/recommendations', {
          method: 'POST', // Use POST since we're sending user data
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ // Send dummy user data for now
            weight: 0,
            height: 0,
            gender: 'none',
            body_part: 'Chest', // Example body part
            level: 'beginner', // Example level
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setRecommendations(data.recommendations);
        } else {
          setError('Failed to fetch recommendations.');
        }
      } catch (err) {
        setError('Error fetching recommendations.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  if (loading) return <p>Loading recommendations...</p>;
  if (error) return <p>{error}</p>;

  return (
    <RecommendationsContainer>
      <Title>AI Workout Recommendations</Title>
      {recommendations && recommendations.map((item, index) => (
        <RecommendationItem key={index}>
          <strong>{item.title}</strong>: {item.description}
        </RecommendationItem>
      ))}
    </RecommendationsContainer>
  );
};

export default AIRecommendations;