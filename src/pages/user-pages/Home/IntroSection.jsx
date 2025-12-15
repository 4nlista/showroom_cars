import React from 'react';
import {
    Container,
    Grid,
    Typography,
    Box,
    Button,
    useTheme,
    Paper
} from '@mui/material';
import {
    EmojiEvents,
    Group,
    DirectionsCar,
    LocationOn,
    VerifiedUser,
    Send
} from '@mui/icons-material';
import { BiSupport } from "react-icons/bi";


const IntroSection = () => {
    const theme = useTheme();

    return (
        <Container>
            <Box sx={{ py: { xs: 8, md: 15 } }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item size={{ xs: 12, md: 6 }}>
                        <Box >
                            <Typography
                                variant="h3"
                                component="h2"
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#000000ff',
                                    fontSize: { xs: '1rem', lg: '2rem' },
                                    mb: 3,
                                    lineHeight: 1.2
                                }}
                            >
                                About Us
                            </Typography>

                            <Typography
                                variant="h3"
                                sx={{
                                    color: '#000000ff',
                                    fontSize: '1.3rem',
                                    lineHeight: 1.6,
                                    mb: 4
                                }}
                            >
                                CarShow is proud to be a leading official car distribution system in Vietnam, accompanying more than 10,000 customers on their journey to find their dream car.
                            </Typography>

                            <Typography
                                variant="h5"
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#000000ff',
                                    fontSize: { xs: '1rem', lg: '2rem' },
                                    mb: 3,
                                    lineHeight: 1.3
                                }}
                            >
                                CarShow - Where Journeys Begin
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    color: '#000000ff',
                                    fontSize: '1.3rem',
                                    mb: 3
                                }}
                            >
                                With over 15 years of experience in the automotive industry, we are proud to be a trusted partner of thousands of families.
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    color: '#000000ff',
                                    fontSize: '1.3rem',
                                    mb: 4
                                }}
                            >
                                More than just a place to buy and sell cars, we are committed to delivering a perfect experience with professional nationwide service.
                            </Typography>

                            <Button
                                variant="contained"
                                size="large"
                                sx={{
                                    px: 4,
                                    py: 1.5,
                                    fontSize: '1.3rem',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    backgroundColor: '#000000ff',
                                    '&:hover': {
                                        backgroundColor: '#ffffffff',
                                        color: '#000000ff',
                                    }
                                }}
                            >
                                Learn more
                            </Button>
                        </Box>
                    </Grid>

                    <Grid item size={{ xs: 12, md: 6 }}>
                        <Box sx={{
                            pl: { lg: 2 },
                            display: 'flex',
                            justifyContent: 'end'
                        }}>
                            <Box sx={{ width: '100%', maxWidth: 500, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Grid container spacing={3}>
                                    <Grid item xs={6}>
                                        <Paper
                                            elevation={2}
                                            sx={{
                                                marginRight: '68px',
                                                textAlign: 'center',
                                                py: 4,
                                                px: 2,
                                                borderRadius: 3,
                                                transition: 'transform 0.3s ease',
                                                width: '100%',
                                                maxWidth: 220,
                                                height: 160,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                '&:hover': {
                                                    transform: 'translateY(-5px)',
                                                    boxShadow: theme.shadows[4]
                                                }
                                            }}
                                        >
                                            <EmojiEvents sx={{
                                                fontSize: 40,
                                                color: '#000000ff',
                                                mb: 1.5
                                            }} />
                                            <Typography
                                                variant="h4"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: '#2c3e50',
                                                    fontSize: '2rem',
                                                    mb: 0.5
                                                }}
                                            >
                                                15+
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: '#000000ff',
                                                    fontWeight: 540,
                                                    fontSize: '1rem'
                                                }}
                                            >
                                                Years of experience
                                            </Typography>
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Paper
                                            elevation={2}
                                            sx={{
                                                marginLeft: '20px',
                                                textAlign: 'center',
                                                py: 4,
                                                px: 2,
                                                borderRadius: 3,
                                                transition: 'transform 0.3s ease',
                                                width: '100%',
                                                maxWidth: 220,
                                                height: 160,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                '&:hover': {
                                                    transform: 'translateY(-5px)',
                                                    boxShadow: theme.shadows[4]
                                                }
                                            }}
                                        >
                                            <Group sx={{
                                                fontSize: 40,
                                                color: '#000000ff',
                                                mb: 1.5
                                            }} />
                                            <Typography
                                                variant="h4"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: '#000000ff',
                                                    fontSize: '2rem',
                                                    mb: 0.5
                                                }}
                                            >
                                                10,000+
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: '#000000ff',
                                                    fontWeight: 500,
                                                    fontSize: '1rem'
                                                }}
                                            >
                                                Trusted customers
                                            </Typography>
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Paper
                                            elevation={2}
                                            sx={{
                                                marginRight: '25px',
                                                textAlign: 'center',
                                                py: 4,
                                                px: 2,
                                                borderRadius: 3,
                                                transition: 'transform 0.3s ease',
                                                width: '100%',
                                                maxWidth: 220,
                                                height: 160,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                '&:hover': {
                                                    transform: 'translateY(-5px)',
                                                    boxShadow: theme.shadows[4]
                                                }
                                            }}
                                        >
                                            <DirectionsCar sx={{
                                                fontSize: 40,
                                                color: '#000000ff',
                                                mb: 1.5
                                            }} />
                                            <Typography
                                                variant="h4"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: '#000000ff',
                                                    fontSize: '2rem',
                                                    mb: 0.5
                                                }}
                                            >
                                                5,000+
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: '#000000ff',
                                                    fontWeight: 500,
                                                    fontSize: '1rem'
                                                }}
                                            >
                                                Successfully delivered cars
                                            </Typography>
                                        </Paper>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <Paper
                                            elevation={2}
                                            sx={{
                                                marginLeft: '25px',
                                                textAlign: 'center',
                                                py: 4,
                                                px: 2,
                                                borderRadius: 3,
                                                transition: 'transform 0.3s ease',
                                                width: '100%',

                                                height: 160,
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                '&:hover': {
                                                    transform: 'translateY(-5px)',
                                                    boxShadow: theme.shadows[4]
                                                }
                                            }}
                                        >
                                            <LocationOn sx={{
                                                fontSize: 40,
                                                color: '#000000ff',
                                                mb: 1.5
                                            }} />
                                            <Typography
                                                variant="h4"
                                                sx={{
                                                    fontWeight: 'bold',
                                                    color: '#000000ff',
                                                    fontSize: '2rem',
                                                    mb: 0.5
                                                }}
                                            >
                                                50+
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                sx={{
                                                    color: '#000000ff',
                                                    fontWeight: 500,
                                                    fontSize: '1rem'
                                                }}
                                            >
                                                Showrooms nationwide
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Grid>
                </Grid>

                <Box mt={20}>
                    <Typography
                        variant="h4"
                        textAlign="center"
                        sx={{
                            fontWeight: 'bold',
                            color: '#000000ff',
                            mb: 6,
                            fontSize: { xs: '2rem', md: '2.5rem' }
                        }}
                    >
                        Why Choose Us?
                    </Typography>

                    <Grid container spacing={6} justifyContent={"center"}>
                        <Grid item size={{ xs: 12, md: 4 }} sx={{ display: 'flex', width: '100%', maxWidth: 430 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                                <Box
                                    sx={{
                                        flexShrink: 0,
                                        width: 60,
                                        height: 60,
                                        borderRadius: '50%',
                                        backgroundColor: '#000000ff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <VerifiedUser sx={{ color: 'white', fontSize: 30 }} />
                                </Box>
                                <Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 'bold',
                                            mb: 2,
                                            fontSize: '1.6rem'
                                        }}
                                    >
                                        Prestige & Quality
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{ fontSize: '1.2rem', lineHeight: 1.7 }}
                                    >
                                        100% genuine vehicles with guaranteed quality and clear origin.
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item size={{ xs: 12, md: 4 }} sx={{ display: 'flex', width: '100%', maxWidth: 430 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                                <Box
                                    sx={{
                                        flexShrink: 0,
                                        width: 60,
                                        height: 60,
                                        borderRadius: '50%',
                                        backgroundColor: '#000000ff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Box
                                        component={BiSupport}
                                        sx={{ color: 'white', fontSize: 30 }}
                                    />
                                </Box>
                                <Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 'bold',
                                            mb: 2,
                                            fontSize: '1.6rem'
                                        }}
                                    >
                                        Comprehensive support
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{ fontSize: '1.2rem', lineHeight: 1.7 }}
                                    >
                                        24/7 consultation, financial support, and lifelong after-sales service.
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item size={{ xs: 12, md: 4 }} sx={{ display: 'flex', width: '100%', maxWidth: 430 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                                <Box
                                    sx={{
                                        flexShrink: 0,
                                        width: 60,
                                        height: 60,
                                        borderRadius: '50%',
                                        backgroundColor: '#000000ff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Send sx={{ color: 'white', fontSize: 30 }} />
                                </Box>
                                <Box>
                                    <Typography
                                        variant="h6"
                                        sx={{
                                            fontWeight: 'bold',
                                            mb: 2,
                                            fontSize: '1.6rem'
                                        }}
                                    >
                                        Transparent process
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{ fontSize: '1.2rem', lineHeight: 1.7 }}
                                    >
                                        Fast procedures, transparent pricing, and no hidden fees.
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default IntroSection;
