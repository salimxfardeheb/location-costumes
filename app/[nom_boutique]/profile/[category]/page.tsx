import React from 'react'

interface Props {
params : {
    category : string;
}
}

const page = async ({ params }: Props) => {
   const { category } = await params;
  return (
    <div>
      {category}
    </div>
  )
}

export default page
