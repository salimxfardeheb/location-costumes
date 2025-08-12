import React, { ReactNode } from 'react'

const layout = ({children} : {children : ReactNode}) => {
  return (
    <div className='body_root'>
      {children}
    </div>
  )
}

export default layout
