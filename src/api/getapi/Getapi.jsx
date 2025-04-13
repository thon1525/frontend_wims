/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
// Function to fetch protected data
export const Getapi = async (token, setProtectedData, setError) => {
    if (!token) {
      setError("No token found. Please login first.");
      return;
    }
  
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/protected-resource/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      setProtectedData(response.data);
    } catch (error) {
      console.error("Error fetching protected data:", error);
      setError("Failed to fetch protected resource.");
    }
  };