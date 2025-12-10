// src/components/CarProgressLoading.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { keyframes } from '@mui/system';

const shine = keyframes`
  0% { left: -100%; }
  100% { left: 100%; }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
`;

const CarProgressLoading = ({
    onComplete,
    duration = 2000,
    minLoadingTime = 1000,
    carImage = "/public/proj_images/loading_car.png"
}) => {
    const [progress, setProgress] = useState(0);
    const [startTime] = useState(Date.now());

    useEffect(() => {
        const steps = 100;
        const interval = duration / steps;

        const timer = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(timer);
                    const elapsed = Date.now() - startTime;
                    const remaining = Math.max(0, minLoadingTime - elapsed);

                    setTimeout(() => {
                        if (onComplete) onComplete();
                    }, remaining);

                    return 100;
                }
                return prevProgress + 1;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [onComplete, duration, minLoadingTime, startTime]);

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #2d2d2d 100%)',
                zIndex: 9999,
                overflow: 'hidden',
            }}
        >
            <Box sx={{ mb: 8, textAlign: 'center',  }}>
                <img
                    src="/proj_images/logo/logo.png"
                    alt="Mercedes Logo"
                    style={{
                        width: 200,
                        height: 200,
                        objectFit: 'contain',
                        marginBottom: 20,
                        
                    }}
                />
                <Typography
                    variant="h4"
                    sx={{
                        color: '#fff', 
                        fontWeight: 300,
                        letterSpacing: '6px',
                        fontFamily: 'serif',
                    }}
                >
                    MERCEDES-BENZ
                </Typography>
            </Box>

            <Box
                sx={{
                    width: '70%',
                    maxWidth: 800,
                    position: 'relative',
                }}
            >
                <Box
                    sx={{
                        width: '100%',
                        height: 6,
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderRadius: 10,
                        overflow: 'hidden',
                        position: 'relative',
                        mb: 3,
                        boxShadow: '0 0 20px rgba(255,255,255,0.1)',
                    }}
                >
                    <Box
                        sx={{
                            height: '100%',
                            width: `${progress}%`,
                            background: 'linear-gradient(90deg, #555 0%, #fff 50%, #555 100%)',
                            borderRadius: 10,
                            transition: 'width 0.1s linear',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: 0,
                                left: '-100%',
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)',
                                animation: `${shine} 1.5s infinite`,
                            }}
                        />
                    </Box>

                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: 0,
                            width: '100%',
                            height: 2,
                            transform: 'translateY(-50%)',
                            background: 'repeating-linear-gradient(90deg, transparent 0px, transparent 20px, rgba(255,255,255,0.2) 20px, rgba(255,255,255,0.2) 40px)',
                            pointerEvents: 'none',
                        }}
                    />
                </Box>

                <Box
                    sx={{
                        position: 'absolute',
                        top: -165,
                        left: `${progress}%`,
                        transform: 'translateX(-50%)',
                        transition: 'left 0.1s linear',
                        animation: progress > 0 ? `${bounce} 0.5s ease-in-out infinite` : 'none',
                    }}
                >
                    <img
                        src={carImage}
                        alt="Mercedes Car"
                        style={{
                            width: '150px',
                            height: 'auto',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.8))',
                        }}
                    />
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography
                        variant="h6"
                        sx={{
                            color: 'rgba(255,255,255,0.7)',
                            fontWeight: 300,
                            letterSpacing: '2px',
                        }}
                    >
                        ĐANG TẢI
                    </Typography>

                    <Typography
                        variant="h3"
                        sx={{
                            color: '#fff',
                            fontWeight: 700,
                            fontFamily: 'monospace',
                        }}
                    >
                        {Math.floor(progress)}%
                    </Typography>
                </Box>

                <Typography
                    variant="body2"
                    sx={{
                        color: 'rgba(255,255,255,0.5)',
                        textAlign: 'center',
                        mt: 3,
                        letterSpacing: '3px',
                        fontSize: '0.9rem',
                    }}
                >
                    {progress < 30 && "Khởi động hệ thống..."}
                    {progress >= 30 && progress < 60 && "Đang tải nội dung..."}
                    {progress >= 60 && progress < 90 && "Chuẩn bị trải nghiệm..."}
                    {progress >= 90 && "Hoàn tất!"}
                </Typography>
            </Box>
        </Box>
    );
};

export default CarProgressLoading;
