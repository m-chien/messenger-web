"use client";

import React from "react";
import { QueryProvider } from "./QueryProvider";
import { ThemeProvider } from "./ThemeContext";
import { AuthProvider } from "./AuthContext";
import { WebSocketProvider } from "./WebSocketContext";
import { CallProvider } from "./CallContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import CallModal from "@/components/call/CallModal";
import VideoCallWindow from "@/components/call/VideoCallWindow";

const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "959381924356-5sdi5bunvmu825hfm75r13a5rktqv2uc.apps.googleusercontent.com";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <ThemeProvider>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <AuthProvider>
            <WebSocketProvider>
              <CallProvider>
                <CallModal />
                <VideoCallWindow />
                {children}
              </CallProvider>
            </WebSocketProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}
