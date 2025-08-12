import React, { ReactNode } from 'react'

const layout = ({children} : {children : ReactNode}) => {
  return (
    <div>
        <h1>dash</h1>
      {children}
    </div>
  )
}

export default layout
