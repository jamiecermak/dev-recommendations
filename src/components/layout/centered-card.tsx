import React from "react";

export function CenteredCardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="dark flex min-h-screen items-center justify-center bg-slate-900 text-white">
      {children}
    </main>
  );
}
