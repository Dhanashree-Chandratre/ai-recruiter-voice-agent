"use client"
import { useUser } from '../../provider.js'
import React from 'react'
import Image from 'next/image'

function WelcomeContainer() {
  const { user } = useUser()
  
  return (
    <div className='bg-white p-4 sm:p-5 md:p-8 rounded-2xl flex flex-col md:flex-row justify-between items-center shadow-sm w-full gap-4'>
      <div className='text-center md:text-left'>
        <h2 className="text-base sm:text-lg md:text-xl font-bold">
          Welcome Back, {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'}!
        </h2>
        <h2 className='text-gray-500 text-sm md:text-base'>AI-Driven Interviews, Hassel-Free Hiring</h2>
      </div>
      {user && <Image src={user?.user_metadata?.avatar_url || user?.picture} alt='User-Avatar' width={40} height={40} className='rounded-full' />}
    </div>
  )
}

export default WelcomeContainer