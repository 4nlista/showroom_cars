import React from 'react'
import Banner from './Banner'
import IntroSection from './IntroSection'
import FeaturedCar from './FeaturedCar'
import AboutUs from './AboutUs'
import Post from './Post'
import MainLayout from '../../../layouts/user-layouts/MainLayout'

const HomePage = () => {
  return (
    <div>
      <MainLayout>
        <Banner />
        <IntroSection />
        <Post />
        <FeaturedCar />
        <AboutUs />
      </MainLayout>
    </div>
  )
}

export default HomePage
