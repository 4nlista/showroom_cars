import React from 'react'
import {
    Button,
} from '@mui/material';
import {
    ArrowForward
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
const ButtonLink = ({ car }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/san-pham/${car.name.toLowerCase().replace(/\s+/g, '-')}`,
            { state: { productId: car.id } });
    };
    return (
        <div>
            <Button
                variant="contained"
                endIcon={<ArrowForward sx={{ fontSize: 16 }} />}
                sx={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%)',
                    color: '#1a1a1a',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    px: 3,
                    py: 1.2,
                    textTransform: 'none',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        background: '#000',
                        color: '#fff',
                    },
                }}
                onClick={handleClick}
            >
                Chi tiết
            </Button>
        </div>
    )
}

export default ButtonLink
