import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Container,
  useTheme,
  useMediaQuery,
  IconButton,
  Button
} from '@mui/material';
import { PlayArrow, Pause } from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Banner = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const swiperRef = useRef(null);

  const videos = [
    {
      id: 1,
      src: '/proj_images/vid-demo/original.mp4',
      poster: '/images/poster1.jpg',
      title: 'Khám Phá Đẳng Cấp Mercedes-Benz'
    },
    {
      id: 2,
      src: '/proj_images/vid-demo/The-G-Class-Experience-Center-in-Graz-Get-G-Proved-1080p-FHD[1080p-FHD]-(www.Download.Tube).mp4',
      poster: '/images/poster2.jpg',
      title: 'Trải Nghiệm G-Class Biểu Tượng Sức Mạnh Và Đẳng Cấp'
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      const firstVideo = document.querySelector('.swiper-slide-active video');
      if (firstVideo) {
        firstVideo.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.log('Không thể tự động phát video:', error);
          setIsPlaying(false);
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handlePlayPause = () => {
    const currentVideo = document.querySelector('.swiper-slide-active video');
    if (currentVideo) {
      if (isPlaying) {
        currentVideo.pause();
        setIsPlaying(false);
      } else {
        currentVideo.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.log('Không thể phát video:', error);
        });
      }
    }
  };

  const handleSlideChange = (swiper) => {
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach(video => video.pause());

    setCurrentSlideIndex(swiper.activeIndex);

    setTimeout(() => {
      const activeVideo = document.querySelector('.swiper-slide-active video');
      if (activeVideo) {
        activeVideo.play().then(() => {
          setIsPlaying(true);
        }).catch((error) => {
          console.log('Không thể phát video mới:', error);
          setIsPlaying(false);
        });
      }
    }, 300);
  };

  return (
    <Container maxWidth={false} disableGutters>
      <Box
        sx={{
          width: '100%',
          height: { xs: 350, sm: 500, md: 600, lg: 700 },
          position: 'relative',
          '& .swiper': {
            width: '100%',
            height: '100%',
          },
          '& .swiper-button-next, & .swiper-button-prev': {
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            width: 50,
            height: 50,
            borderRadius: '50%',
            '&:after': {
              fontSize: '24px',
            },
          },
          '& .swiper-pagination': {
            bottom: '20px',
          },
          '& .swiper-pagination-bullet': {
            backgroundColor: 'white',
            opacity: 0.7,
            width: 12,
            height: 12,
          },
          '& .swiper-pagination-bullet-active': {
            backgroundColor: 'black',
            opacity: 1,
          },
        }}
      >
        <Swiper
          ref={swiperRef}
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          loop={true}
          onSlideChange={handleSlideChange}
        >
          {videos.map((video, index) => (
            <SwiperSlide key={video.id}>
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                }}
              >
                <video
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  muted
                  loop={false}
                  playsInline
                  poster={video.poster}
                  preload="auto"
                  onError={(e) => {
                    console.log('Lỗi tải video:', e.target.src);
                  }}
                >

                  <source src={video.src} type="video/mp4" />
                  Trình duyệt của bạn không hỗ trợ video.
                </video>
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: { xs: 80, md: 250 },
                      left: { xs: 25, md: 90 },
                      zIndex: 20,
                      color: 'white',
                      fontWeight: 550,
                      fontSize: { xs: '1.2rem', md: '1.5rem', lg: '2.8rem' },
                      textShadow: '0 2px 8px rgba(0,0,0,0.7)',
                      maxWidth: { xs: '90%', md: '30%' },
                      pointerEvents: 'none',
                    }}
                  >
                    {video.title}
                  </Box>

                

                <Box sx={{
                  position: 'absolute',
                  bottom: { xs: 20, md: 180 },
                  left: { xs: 25, md: 90 },
                  border: '2px solid white',
                  borderRadius: '6px',
                }}>
                  <Button sx={{
                    width: '200px',
                    color: 'white',
                    borderColor: 'white',
                    fontWeight: 550,
                    fontSize: { xs: '0.7rem', md: '0.9rem', lg: '1rem' },
                    padding: '10px',
                    '&:hover': {
                      backgroundColor: 'white',
                      color: 'black',
                    },
                  }} variant="outlined" >Tìm hiểu thêm</Button>
                </Box>
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '200px',
                    background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                    pointerEvents: 'none',
                  }}
                />
              </Box>

            </SwiperSlide>
          ))}
        </Swiper>
        <IconButton
          onClick={handlePlayPause}
          sx={{
            position: 'absolute',
            bottom: { xs: 20, md: 30 },
            left: { xs: 20, md: 30 },
            zIndex: 10,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            width: { xs: 50, md: 60 },
            height: { xs: 50, md: 60 },
            backdropFilter: 'blur(10px)',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            '&:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.9)',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.3s ease',
          }}
        >
          {isPlaying ?
            <Pause sx={{ fontSize: { xs: 24, md: 28 } }} /> :
            <PlayArrow sx={{ fontSize: { xs: 24, md: 28 } }} />
          }
        </IconButton>
      </Box>
    </Container>
  );
};

export default Banner;
