import React from 'react'
import { FaArrowRight, FaAward } from 'react-icons/fa'

const About = () => {
  return (
    <div className='pt-16 pb-8'>
        <div className='w-4/5 mx-auto grid grid-cols-1 lg:grid-cols-2 items-center gap-16'>
        {/* 1st part */}
        <div data-aos="fade-right" data-aos-anchor-placement="top-center">
            <div className='flex items-center space-x-4'>
                <div className='w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center flex-col'>
                    <FaAward className='h-6 w-6 text-white' />
                </div>
                <h1 className='text-xl text-black dark:text-gray-50 font-semibold'>Guaranteed and certified</h1>
            </div>
            <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-6xl mt-8 font-bold md:leading-[3rem] lg:leading-[3.5rem] xl:leading-[3.9rem] text-gray-800 dark:text-gray-300'>Online learning wherever and whenever.</h1>
            <p className='mt-4 text-gray-600 dark:text-gray-500'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate non repellendus aliquam, dicta blanditiis voluptatum autem error culpa inventore.</p>
            <button className='flex items-center space-x-2 px-8 py-3 mt-8 hover:bg-gray-700 dark:hover:bg-gray-200 transition-all duration-200 rounded-3xl bg-black dark:bg-white text-white dark:text-black'>
                <span>Learn More</span>
                <FaArrowRight />
            </button>
        </div>
        {/* 2nd part */}
        <div data-aos="fade-left" data-aos-anchor-placement="top-center" data-aos-delay="150">
            <div>
                <h1 className='text-7xl lg:text-9xl font-bold text-black dark:text-white text-opacity-5 dark:text-opacity-15'>01</h1>
                <div className='-mt-10'>
                    <h1 className='text-xl md:text-2xl text-opacity-70 mb-3 text-black dark:text-gray-300 font-bold'>Flexible Schedule</h1>
                    <p className='w-[90%] lg:w-[70%] text-base text-black dark:text-gray-300 text-opacity-60 dark:text-opacity-60'>Lorem ipsum dolor sit amet consectetur adipisicing elit Lorem ipsum dolor sit amet. Temporibus, similique?</p>
                </div>
                
            </div>
            <div className='mt-8 w-full'>
                <h1 className='text-7xl lg:text-9xl font-bold text-black dark:text-white text-opacity-5 dark:text-opacity-15'>02</h1>
                <div className='-mt-10'>
                    <h1 className='text-xl md:text-2xl text-opacity-70 mb-3 text-black dark:text-gray-300 font-bold'>Pocket Friendly</h1>
                    <p className='w-[90%] lg:w-[70%] text-base text-black dark:text-gray-300 text-opacity-60 dark:text-opacity-60'>Lorem ipsum dolor sit amet consectetur adipisicing elit Lorem ipsum dolor sit amet. Temporibus, similique?</p>
                </div>
                
            </div>
        </div>
        </div>
    </div>
  )
}

export default About