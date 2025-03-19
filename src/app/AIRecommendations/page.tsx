"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

function AIRecommendations() {
    const searchParams = useSearchParams();
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/recommendations?weight=${searchParams.get('weight')}&height=${searchParams.get('height')}&body_part=${searchParams.get('bodyPart')}&level=${searchParams.get('level')}&days_per_week=${searchParams.get('daysPerWeek')}`);
                if (response.ok) {
                    const data = await response.json();
                    setRecommendations(data);
                } else {
                    setError('Failed to fetch data.');
                }
            } catch (err) {
                setError('Error fetching data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchParams]);

    if (loading) return <p>Loading recommendations...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div>
            <h1>Recommendations</h1>
            {recommendations && (
                <div>
                    <p>BMI: {recommendations.bmi}</p>
                    <p>Fitness Goal: {recommendations.fitness_goal}</p>
                    <h2>Workout Plan:</h2>
                    <ul>
                        {recommendations.recommendations.map((item, index) => (
                            <li key={index}>
                                <strong>{item.title}</strong>: {item.description}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default AIRecommendations;