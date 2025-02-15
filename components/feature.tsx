'use client'

import Image from 'next/image'
import React, { useEffect } from 'react'
import { FaBriefcase } from 'react-icons/fa'
import Tilt from 'react-parallax-tilt'

import AOS from 'aos';
import 'aos/dist/aos.css'; 



const Feature = () => {

  useEffect(() => {
    const initAOS = async ()=> {
        await import('aos');
        AOS.init({
            duration: 1000,
            easing:"ease",
            once: true,
            anchorPlacement: "top-bottom",
        });
    }

    initAOS();
  
}, []);

  return (
    <div className='pt-16 pb-16'>
        <div className='mt-8 grid grid-cols-1 xl:grid-cols-2 items-center gap-12 mx-auto'>
            {/* image */}
            <Tilt>
                <div data-aos="zoom-in" data-aos-anchor-placement="top-center" data-aos-delay="150">
                    <Image src="/images/hero.png" alt='image' width={1000} height={1000}/>
                </div>
            </Tilt>
            {/* text */}
            <div>
                <div className='flex items-center space-x-4'>
                    <div className='w-12 h-12 bg-rose-600 rounded-full flex items-center justify-center flex-col'>
                        <FaBriefcase className='h-6 w-6 text-white' />
                    </div>
                    <h1 className='text-xl text-black dark:text-gray-50 font-semibold'>Premium learning experience</h1>
                </div>
                <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-6xl mt-8 font-bold md:leading-[3rem] lg:leading-[3.5rem] xl:leading-[3.9rem] text-gray-800 dark:text-gray-300'>Providing amazing online courses.</h1>
                <div className='mt-8 mb-6'>
                    <h1 className='text-lg md:text-2xl text-black dark:text-gray-50 text-opacity-70 dark:text-opacity-70 font-semibold'>Master the skills that matter to you</h1>
                    <p className='text-sm md:text-base text-black dark:text-white text-opacity-70 dark:text-opacity-70 mt-4'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Placeat, adipisci? Perferendis a non totam laborum modi placeat eum iusto quam.</p>
                </div>
                <div className='mt-8 mb-6'>
                    <h1 className='text-lg md:text-2xl text-black dark:text-gray-50 text-opacity-70 dark:text-opacity-70 font-semibold'>Increase your learning skills</h1>
                    <p className='text-sm md:text-base text-black dark:text-white text-opacity-70 dark:text-opacity-70 mt-4'>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Placeat, adipisci? Perferendis a non totam laborum modi placeat eum iusto quam.</p>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Feature