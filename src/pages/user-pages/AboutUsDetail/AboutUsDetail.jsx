import React from 'react'
import MainLayout from '../../../layouts/user-layouts/MainLayout'
import Navbar from './HeroContainer'
import IntroSection from './IntroSetion'
import { Box } from '@mui/material'
const AboutDetail = () => {
  return (
    <div>
      <MainLayout>
        <Box sx={{backgroundColor: 'black'}}>
        <Navbar />
        <IntroSection />
        </Box>
      </MainLayout>
    </div>
  )
}

export default AboutDetail
