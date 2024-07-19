import React from 'react'

const Myvideo = () => {
  return (
    <div  className="bg-gray-100 min-h-screen"> 
         <div className="flex justify-center items-center h-screen">
      <video
        src="/videoplayback.mp4"
        className="w-full max-w-4xl h-auto rounded-lg shadow-lg"
        autoPlay
        muted
        loop
      ></video>
    </div>
    </div>
  )
}

export default Myvideo