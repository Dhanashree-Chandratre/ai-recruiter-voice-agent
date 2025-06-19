import React from 'react'
import DashboardProvider from './provider'

function DashboardLayout({children}) {
  return (
    <div className="w-full">
        <DashboardProvider>
          <div className='w-full'>
            {children}
          </div>
        </DashboardProvider>
    </div>
  )
}

export default DashboardLayout