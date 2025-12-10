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
                                Về Chúng Tôi
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
                                CarShow tự hào là hệ thống phân phối xe hơi chính hãng hàng đầu Việt Nam, đồng hành cùng hơn 10.000 khách hàng trong hành trình tìm kiếm chiếc xe mơ ước.
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
                                CarShow - Nơi Khởi Đầu Những Hành Trình
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    color: '#000000ff',
                                    fontSize: '1.3rem',
                                    mb: 3
                                }}
                            >
                                Với hơn 15 năm kinh nghiệm trong ngành ô tô, chúng tôi tự hào là đối tác tin cậy của hàng nghìn gia đình Việt Nam.
                            </Typography>

                            <Typography
                                variant="body1"
                                sx={{
                                    color: '#000000ff',
                                    fontSize: '1.3rem',
                                    mb: 4
                                }}
                            >
                                Không chỉ là nơi mua bán xe, chúng tôi cam kết mang đến trải nghiệm hoàn hảo với dịch vụ chuyên nghiệp toàn quốc.
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
                                Tìm hiểu thêm
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
                                                Năm kinh nghiệm
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
                                                Khách hàng tin tưởng
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
                                                Xe đã giao thành công
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
                                                Showroom toàn quốc
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
                        Tại Sao Chọn Chúng Tôi?
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
                                        Uy tín & Chất lượng
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{ fontSize: '1.2rem', lineHeight: 1.7 }}
                                    >
                                        Cam kết 100% xe chính hãng, đảm bảo chất lượng và nguồn gốc rõ ràng.
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
                                        Hỗ trợ toàn diện
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{ fontSize: '1.2rem', lineHeight: 1.7 }}
                                    >
                                        Tư vấn 24/7, hỗ trợ tài chính và dịch vụ hậu mãi trọn đời.
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
                                        Quy trình minh bạch
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{ fontSize: '1.2rem', lineHeight: 1.7 }}
                                    >
                                        Thủ tục nhanh gọn, giá cả minh bạch, không phí ẩn.
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
