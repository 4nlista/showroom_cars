import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';

const HeroContainer = () => {
  return (
    <Box
      sx={{
        marginTop: '100px',
        position: 'relative',
        minHeight: '90vh',
        background: 'linear-gradient(180deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 40%, transparent 100%)',
          pointerEvents: 'none',
          zIndex: 2,
        }
      }}
    >
      <Box
        sx={{
          
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("public/proj_images/aboutus/nav.avif")', 
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 1,
        }}
      />
      <Container
        maxWidth="xl"
        sx={{
          position: 'relative',
          zIndex: 3,
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ maxWidth: { xs: '100%', md: '80%' } }}>
              <Typography
                variant="h1"
                sx={{
                  width: 600,
                  color: '#ffffff',
                  fontWeight: 300,
                  fontSize: { xs: '2rem', md: '2.5rem', lg: '2.5rem' },
                  lineHeight: 1.2,
                  mb: 1,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.7)',
                }}
              >
                Định nghĩa về xe luôn thay đổi, nhưng đẳng cấp thì không.
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  color: '#cccccc',
                  fontSize: '1rem',
                  mb: 4,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.7)',
                  marginBottom: {xs: 2, md: 9}
                }}
              >
                Khi đó là Mercedes-Benz.
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Button
                  variant="outlined"
                  sx={{
                    backgroundColor: 'transparent',
                    color: '#ffffff',
                    border: '2px solid #ffffff',
                    fontWeight: 700,
                    textTransform: 'none',
                    borderRadius: 0,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#ffffff',
                      color: '#000000',
                    },
                  }}
                >
                  Khám phá những điểm nổi bật
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#0066cc',
                    color: '#ffffff',
                    px: 3,
                    py: 1.5,
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 0,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: '#0052a3',
                    },
                  }}
                >
                  Liên hệ
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default HeroContainer;
