import React from 'react'

const AuthLayout = ({children}) => {
  return (
    <div className='flex'>
        <div className='w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12'>
            <h2 className='text-lg font-medium text-black'>TaskHub</h2>
            {children}
        </div>

        <div className="hidden md:flex w-[40vw] h-screen items-center justify-center bg-blue-50 bg-[url('/bg-img.pmg')] bg-cover bg-no-repeat bg-center overflow-hidden">
            <img src="bs bd " alt="login image" className='w-64 lg:w-[90%]'/>
        </div>
    </div>
  )
}

export default AuthLayout