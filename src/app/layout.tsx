"use client"
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.scss";

import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();
  return (
    <html lang="en">
      <QueryClientProvider client={queryClient}>
        <body>{children}</body>
      </QueryClientProvider>
    </html>
  );
}
