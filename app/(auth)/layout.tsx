import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="grid w-full max-w-4xl grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="flex flex-col items-start gap-4">
          <h1 className="text-4xl font-bold text-gray-800 sm:text-5xl">
            Welcome to the Literature Society
          </h1>
          <p className="max-w-md text-gray-600 sm:text-lg">
            Discover, discuss, and share your love for literature, movie, and painting
          </p>
        </div>

        <div className="rounded-lg bg-white p-8 shadow-md">{children}</div>
      </div>
    </div>
  );
}