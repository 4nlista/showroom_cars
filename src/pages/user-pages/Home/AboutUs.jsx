import React, { use } from 'react'
import { Box, Button, Card, CardMedia, Container, Grid, Paper, Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {

    const navigate = useNavigate();
    return (
        <Container>
            <Grid container spacing={2}>
                <Box sx={{ py: { xs: 6, md: 8 } }}>
                    <Grid container spacing={10}>
                        <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <Card sx={{ maxWidth: 650, height: 400 }}>
                                <CardMedia
                                    component="img"
                                    height="100%"
                                    image="/Images/aboutus/intro.avif"
                                    alt="Mercedes-Benz heritage"
                                />
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div>
                                <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', fontSize: { xs: '2rem', md: '2.5rem' } }}>
                                    A LEGACY OF EXCELLENCE SINCE 1886.
                                </Typography>
                                <Typography variant="body1" gutterBottom sx={{ fontSize: '1.1rem', color: '#1d1d1dff', mt: 3 }}>
                                    The definition of a car may change over time, but true luxury remains timeless. Especially when it’s Mercedes-Benz.
                                </Typography>
                                <Button
                                    variant="contained"
                                    size="large"
                                    sx={{
                                        maxWidth: 300,
                                        px: 4,
                                        py: 1.5,
                                        fontSize: '1.3rem',
                                        marginTop: 5,
                                        fontWeight: 600,
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        backgroundColor: '#000000ff',
                                        '&:hover': {
                                            backgroundColor: '#ffffffff',
                                            color: '#000000ff',
                                        }
                                    }}
                                    onClick={() => navigate("/aboutus")}
                                >
                                    Learn More
                                </Button>
                            </div>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Container >
    )
}

export default AboutUs