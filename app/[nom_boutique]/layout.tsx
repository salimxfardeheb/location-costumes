import React, { ReactNode } from 'react'
import Dashboard from './dashboard/page'
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const layout = ({children} : {children : ReactNode}) => {
  return (
    <div>
        <h1>dash</h1>
      {children}
    </div>
  )
}

export default layout
