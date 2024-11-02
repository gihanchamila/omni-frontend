import React from 'react'
import Button from '../component/button/Button.jsx'

const OurStory = () => {
  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-50 rounded-lg">
        <div className="p-10 space-y-4">
            <h2 className="text-[4rem] font-bold mb-2 leading-[64px]">Voices & Visions</h2>
            <span className="text-xl block mb-4">A space to share thoughts, connect ideas, and inspire new perspectives</span>
            <button className='transition-colors duration-100 font-medium rounded-lg text-sm px-4 py-3 focus:outline-none tracking-wider bg-blue-500 text-white hover:bg-blue-600 '>
                Explore Stories

            </button>
        </div>
    </div>
  )
}

export default OurStory