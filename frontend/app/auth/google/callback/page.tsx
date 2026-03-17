"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../../../contexts/AuthContext";

import { Suspense } from "react";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get("token");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      const decodedError = decodeURIComponent(errorParam);
      console.error("Google OAuth error:", decodedError);
      setError(decodedError);
      setIsLoading(false);
      return;
    }

    if (!token) {
      console.error("No token received from Google authentication");
      setError("No authentication token received. Please try again.");
      setIsLoading(false);
      return;
    }

    try {
      // Store token in localStorage
      localStorage.setItem("token", token);
      
      // Trigger auth context update
      login(token);
      
      // Redirect to home page
      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (err) {
      console.error("Error processing authentication:", err);
      setError("Failed to process authentication. Please try again.");
      setIsLoading(false);
    }
  }, [searchParams, login, router]);

  return (
    <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="text-center">
        {isLoading && !error && (
          <>
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Completing Google sign in...</p>
          </>
        )}
        {error && (
          <div className="alert alert-danger" role="alert">
            <h4 className="alert-heading">Authentication Failed</h4>
            <p>{error}</p>
            <hr />
            <a href="/login" className="btn btn-primary">
              Back to Login
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default function GoogleCallback() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <GoogleCallbackContent />
    </Suspense>
  );
}
