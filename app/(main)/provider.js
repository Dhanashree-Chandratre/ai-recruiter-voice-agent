"use client"
import React, { createContext, useContext, useEffect, useState } from 'react'
import { SidebarProvider, SidebarTrigger } from '../../components/ui/sidebar.jsx'
import { AppSidebar } from './_components/AppSidebar'
import { supabase } from '../../services/supabaseClient'
import { Menu } from 'lucide-react'

const UserContext = createContext()

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

function DashboardProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } = {} } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => { if (subscription) subscription.unsubscribe() }
  }, [])

  return (
    <UserContext.Provider value={{ user, loading }}>
      <SidebarProvider>
        <div className="flex min-h-screen bg-gray-100" style={{ '--sidebar-width': '16rem' }}>
          <AppSidebar />
          <SidebarTrigger className="fixed top-4 left-[3rem] md:left-[16rem] z-50">
             <Menu className='cursor-pointer' />
          </SidebarTrigger>
          <main className="flex-1 relative py-4 overflow-y-auto">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </UserContext.Provider>
  )
}

export default DashboardProvider
