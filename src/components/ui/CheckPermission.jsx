"use client";
import React from 'react';
import { useAuth } from '../../context/AuthContext';

export default function CheckPermission({ category, action, children }) {
  const { hasPermission, isLoading, user } = useAuth();
  
  if (isLoading) return null; // Don't flash elements during boot load
  
  // Directly render if the user possesses the correct permissions for the given node
  if (user && hasPermission(category, action)) {
    return children;
  }
  
  // Action denied
  return null;
}
