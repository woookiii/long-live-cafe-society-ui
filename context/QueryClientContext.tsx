'use client'

import LoadingPage from '@/app/loading';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, Suspense } from 'react'


export default function QProvider({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  }); 

  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<LoadingPage/>}>
        {children}
      </Suspense>
    </QueryClientProvider>
  )
}
