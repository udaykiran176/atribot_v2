"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";


export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = async () => {
    try {
      setError(null);
      
      // Store the loading state in sessionStorage to persist across redirects
      sessionStorage.setItem('isGoogleSigningIn', 'true');
      
      // Use the auth callback route with the canonical URL
      const callbackURL = `${process.env.NEXT_PUBLIC_APP_URL || window.location.origin}/api/auth/callback`;
      
      try {
        await authClient.signIn.social({
          provider: "google",
          callbackURL,
        });
      } catch (error) {
        console.error("Sign-in error:", error);
        throw error;
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      setError("Failed to sign in. Please try again or check your network connection.");
      sessionStorage.removeItem('isGoogleSigningIn');
      throw err; // Re-throw to be caught by the button's onClick handler
    }
  };

  // Check for auth errors in URL query params
  useEffect(() => {
    // Check for error in URL params
    const params = new URLSearchParams(window.location.search);
    const error = params.get('error');
    
    if (error) {
      setError(error);
      // Clean up the URL
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
    
    // Clear any existing sign-in state
    sessionStorage.removeItem('isGoogleSigningIn');
  }, []);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className=" border-none shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Login with your Google account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          <Button
            variant="outline"
            className="w-full gap-2"
            type="button"
            onClick={() => {
              setIsLoading(true);
              signInWithGoogle().catch(() => setIsLoading(false));
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>Signing in with Google...</span>
              </>
            ) : (
              <>
                <FcGoogle className="w-5 h-5" />
                <span>Sign in with Google</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <a href="#" className="text-blue-500">Terms of Service</a> and{" "}
        <a href="#" className="text-blue-500">Privacy Policy</a>.
      </div>
    </div>
  );
}
