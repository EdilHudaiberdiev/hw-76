'use client';
import { Inter } from "next/font/google";
import "./globals.css";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import React from "react";

const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html lang="en">
    <body>
    <main>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>

    </main>
    </body>
    </html>
  );
}
