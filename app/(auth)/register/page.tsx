'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '@/api/auth';

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const { mutateAsync, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      router.replace('/');
    },
    onError: (err: any) => {
      setError(err.message);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync({ name, email, password });
  };

  return (
    <div className='max-w-md mx-auto'>
      <h1 className="text-3xl font-bold mb-6">
        Register
      </h1>
      {error && (
      <div className='bg-red-100 text-red-700 px-4 py-2 rounded mb-4'>
        {error}
      </div>
      )
    }

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="w-full border border-gray rounded-md p-2"
          placeholder='Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete='off'
        />
        <input
          type="email"
          className="w-full border border-gray rounded-md p-2"
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete='off'
        />
        <input
          type="password"
          className="w-full border border-gray rounded-md p-2"
          placeholder='Password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete='off'
        />
        <button
          className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-md w-full disabled:opacity-50"
          disabled={isPending}
        >
          {isPending ? 'Registering...' : 'Register'}
        </button>
      </form>

      <p className="text-sm text-center mt-4">
        Already have an account?{' '}
        <Link href='/login' className='text-blue-600 hover:underline-medium'>Login</Link>
      </p>
    </div>
  );
}