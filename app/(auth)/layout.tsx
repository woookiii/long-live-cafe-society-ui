import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row items-start justify-between gap-10 p-6 text-blue-600">
      <div className="flex flex-col items-start gap-4">
        <h1 className="text-4xl font-bold text-gray-800">Welcome to literature society</h1>
        <p className="text-gray-600 max-w-xs">
          Discover, discuss, and share your love for literature, poetry.
        </p>
      </div>

      <section className="flex-1 text-gray-600">
        {children}
      </section>
    </div>
  );
}