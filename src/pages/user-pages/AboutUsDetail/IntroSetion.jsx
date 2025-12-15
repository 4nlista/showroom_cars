import { Box, Grid, Paper, Typography, Button, Stack, Container } from '@mui/material'

const IntroSection = () => {
    const post = [
        {
            id: 1,
            title: '...a perfect space to relax.',
            img: '/Images/aboutus/card1.avif'
        },
        {
            id: 2,
            title: '...a fully equipped workspace.',
            img: '/Images/aboutus/card2.avif'
        },
        {
            id: 3,
            title: '...a private cinema.',
            img: '/Images/aboutus/card3.webp'
        },
        {
            id: 4,
            title: '...a cutting-edge technology hub.',
            img: '/Images/aboutus/card4.jpg'
        },
        {
            id: 5,
            title: '...a safe and secure zone.',
            img: '/Images/aboutus/card5.avif'
        }
    ]

    return (
        <Box sx={{ flexGrow: 1, p: 2 }}>
            <Container maxWidth="xl">
                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        width: 850,
                        fontWeight: '570',
                        mb: 4,
                        textAlign: 'left',
                        color: '#7f7f7fff',
                        letterSpacing: 1,
                        fontSize: { xs: '0.45rem', lg: '1rem' },
                    }}
                >
                    For 138 years of continuous research and technological innovation, Mercedes-Benz has evolved from a simple means of transportation into a relaxing sanctuary, a mobile office, and a safe zone — fully satisfying the needs of its owners.
                </Typography>

                <Typography
                    variant="h4"
                    component="h1"
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        width: 850,
                        fontWeight: '570',
                        mb: 8,
                        textAlign: 'left',
                        color: '#848484ff',
                        letterSpacing: 1,
                        fontSize: { xs: '0.45rem', lg: '1rem' },
                    }}
                >
                    We are proud that every car can become...
                </Typography>
                <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                    {post.map((post, index) => (
                        <Grid key={post.id} size={{ xs: 2, sm: 4, md: index === 0 ? 8 : 4 }}>
                            <Paper
                                sx={{
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    mb: 2,
                                    background: 'none',
                                    boxShadow: 'none',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: index === 0 ? { xs: 350, md: 640 } : { xs: 353, md: 642 },
                                    '&:hover .post-image': {
                                        transform: 'scale(1.05)',
                                    }
                                }}
                            >
                                <Box
                                    sx={{
                                        position: 'relative',
                                        height: '100%',
                                        overflow: 'hidden',
                                    }}
                                >

                                    <Box
                                        className="post-image"
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            backgroundImage: `url("${post.img}")`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            transition: 'transform 0.3s ease-in-out',
                                        }}
                                    />
                                    <Typography
                                        variant={index === 0 ? "h5" : "h6"}
                                        component="h2"
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            color: '#fff',
                                            padding: '8px 12px',
                                            fontWeight: 'bold',
                                            fontSize: {
                                                xs: index === 0 ? '0.875rem' : '0.875rem',
                                                md: index === 0 ? '1rem' : '1rem'
                                            },
                                            lineHeight: 1.2,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            '&::before': {
                                                content: '""',
                                                position: 'absolute',
                                                bottom: 0,
                                                left: 0,
                                                right: 0,
                                                height: '80%',
                                                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 10%, rgba(0,0,0,0.4) 30%, transparent 100%)',
                                                zIndex: 8,
                                            }
                                        }}
                                    >
                                        {post.title}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    )
}

export default IntroSection
