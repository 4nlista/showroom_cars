import React from 'react'
import HeaderAuth from '../../components/user-components/HeaderAuth'
import Footer from '../../components/user-components/Footer'

const AuthLayout = ({children}) => {
  return (
    <div>
       <HeaderAuth />
       {children}
       <Footer />
    </div>
  )
}

export default AuthLayout
