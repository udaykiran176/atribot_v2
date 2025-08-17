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
      setIsLoading(true);
      
      // Use the auth callback route for proper redirect handling
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/api/auth/callback",
      });
    } catch (err) {
      console.error("Sign-in error:", err);
      setError("Failed to sign in. Please try again or check your network connection.");
      throw err; // Re-throw to be caught by the button's onClick handler
    } finally {
      setIsLoading(false);
    }
  };

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
