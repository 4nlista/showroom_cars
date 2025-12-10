import { Box, Grid, Paper, Typography, Button, Stack, Container } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { getPosts } from '../../../services/postApi'

const Post = () => {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts()
        setPosts(data)
        console.log("Posts data:", data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    }

    fetchPosts()
  }, [])

  return (
    <Box sx={{ flexGrow: 1, p: 2 }}>
      <Container maxWidth="xl">
        <Typography
          variant="h4"
          component="h1"
          sx={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 7,
            fontWeight: 'bold',
            mb: 8,
            textAlign: 'left',
            color: '#222',
            letterSpacing: 1,
             fontSize: { xs: '2rem', lg: '2.7rem' },
          }}
        >
          Tin Tức & Khuyến Mại
        </Typography>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {posts.map((post, index) => (
            <Grid key={post.id} size={{ xs: 2, sm: 4, md: index === 0 ? 8 : 4 }}>
              <Paper
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  cursor: 'pointer',
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
                    height: '80%',
                    overflow: 'hidden',
                  }}
                >
                  <Box
                    className="post-image"
                    sx={{
                      width: '100%',
                      height: '100%',
                      backgroundImage: `url("${post.image}")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      transition: 'transform 0.3s ease-in-out',
                    }}
                  />

                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '40%',
                      background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.85) 100%)',
                      pointerEvents: 'none',
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    height: '30%',
                    color: 'white',
                    p: { xs: 2, md: 3 },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    backgroundColor: '#111',
                  }}
                >
                  <Typography
                    variant={index === 0 ? "h5" : "h6"}
                    component="h2"
                    sx={{
                      fontWeight: 'bold',
                      mb: 1,
                      fontSize: {
                        xs: index === 0 ? '1.2rem' : '1rem',
                        md: index === 0 ? '1.5rem' : '1.4rem'
                      },
                      lineHeight: 1.2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {post.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      mb: 3,
                      opacity: 0.9,
                      fontSize: {
                        xs: '0.75rem',
                        md: index === 0 ? '1rem' : '1rem'
                      },
                      display: '-webkit-box',
                      WebkitLineClamp: 6,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {post.subtitle}
                  </Typography>

                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ flexWrap: 'wrap' }}
                  >
                    {post.buttons && post.buttons.map((button, buttonIndex) => (
                      <Button
                        key={buttonIndex}
                        variant={button.variant}
                        size="small"
                        sx={{
                          color: 'white',
                          backgroundColor: button.variant === 'contained' ? 'primary.main' : 'transparent',
                          borderColor: button.variant === 'outlined' ? 'white' : 'none',
                          '&:hover': {
                            backgroundColor: button.variant === 'contained'
                              ? 'primary.dark'
                              : 'rgba(255, 255, 255, 0.1)',
                          },
                          fontSize: { xs: '0.7rem', md: '0.8rem' },
                          px: { xs: 1.5, md: 2 },
                          py: { xs: 0.5, md: 0.75 },
                        }}
                      >
                        {button.text}
                      </Button>
                    ))}
                  </Stack>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

export default Post
