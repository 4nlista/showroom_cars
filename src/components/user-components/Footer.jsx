import React from "react";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button
} from "@mui/material";

const Footer = () => {
  const footerSections = [
    {
      title: "Các dòng xe",
      items: [
        "Xe thuần điện EQ",
        "Sedan",
        "SUV",
        "Cabriolet và Roadster",
        "Mercedes-AMG",
        "Mercedes-Maybach",
        "Xe đa dụng"
      ]
    },
    {
      title: "Mua xe",
      items: [
        "Ưu đãi mới nhất",
        "Tìm xe mới",
        "Tìm xe đã qua sử dụng",
        "Bảng giá & Brochure",
        "Cấu hình xe",
        "Khối doanh nghiệp & Khách hàng ưu tiên"
      ]
    },
    {
      title: "Tư vấn mua xe",
      items: [
        "Yêu cầu tư vấn",
        "Đăng ký lái thử",
        "Tìm Nhà phân phối gần nhất"
      ]
    },
    {
      title: "Dịch vụ",
      items: [
        "Ưu đãi dịch vụ",
        "Đặt hẹn dịch vụ",
        "Hướng dẫn sử dụng dành cho chủ sở hữu xe",
        "Phụ kiện chính hãng",
        "Bộ sưu tập Mercedes-Benz",
        "Triệu hồi"
      ]
    },
    {
      title: "Khám phá Mercedes",
      items: [
        "Câu chuyện của chúng tôi",
        "Cơ hội việc làm",
        "Liên hệ",
        "Quyền riêng tư"
      ]
    }
  ];

  return (
    <Box
      sx={{
        backgroundColor: "#000000",
        color: "white",
        padding: "60px 0 40px 0",
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4}>
          {footerSections.map((section, index) => (
            <Grid item xs={12} sm={6} md={2.4} key={index}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  fontSize: "18px",
                  marginBottom: "24px",
                  color: "white",
                }}
              >
                {section.title}
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                {section.items.map((item, itemIndex) => (
                  <Button
                    key={itemIndex}
                    sx={{
                      color: "#cccccc",
                      fontSize: "14px",
                      fontWeight: 400,
                      textTransform: "none",
                      justifyContent: "flex-start",
                      padding: "4px 0",
                      minWidth: "auto",
                      transition: "color 0.2s ease",
                      "&:hover": {
                        backgroundColor: "transparent",
                        color: "white"
                      },
                    }}
                  >
                    {item}
                  </Button>
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box
          sx={{
            marginTop: "60px",
            padding: "40px 0",
            borderTop: "1px solid #333",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontWeight: 600,
              marginBottom: "30px",
              color: "white",
              textAlign: "center"
            }}
          >
            Tìm Showroom Mercedes-Benz
          </Typography>

          <Grid container spacing={4} alignItems="center" justifyContent="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ height: "400px", width: "650px" }}>
                <div
                  id="google-map"
                  style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#333",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "1px solid #555"
                  }}
                >
                  <iframe
                    title="Google Map"
                    width="100%"
                    height="100%"
                    style={{
                      border: 0,
                      borderRadius: "8px",
                      minHeight: 400
                    }}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps?q=21.013385216924114,105.5270913929867&z=16&output=embed"
                  />
                </div>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box sx={{ paddingLeft: { xs: 0, md: 4 } }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    marginBottom: "20px",
                    color: "white"
                  }}
                >
                  Thông tin liên hệ
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Typography sx={{ color: "#cccccc", fontSize: "14px" }}>
                    📍 Địa chỉ: 132a, Đường Lê Văn Miến
                  </Typography>
                  <Typography sx={{ color: "#cccccc", fontSize: "14px" }}>
                    📞 Hotline: 0867897979
                  </Typography>
                  <Typography sx={{ color: "#cccccc", fontSize: "14px" }}>
                    ✉️ Email: nguyenductuan92@gmail.com
                  </Typography>
                  <Typography sx={{ color: "#cccccc", fontSize: "14px" }}>
                    🕒 Giờ làm việc: 8:00 - 18:00 (Thứ 2 - Chủ nhật)
                  </Typography>
                </Box>

                <Button
                  variant="outlined"
                  sx={{
                    marginTop: "24px",
                    color: "white",
                    borderColor: "white",
                    textTransform: "none",
                    padding: "10px 24px",
                    "&:hover": {
                      backgroundColor: "white",
                      color: "black",
                      borderColor: "white"
                    }
                  }}
                >
                  Đặt lịch hẹn
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box
          sx={{
            borderTop: "1px solid #333",
            marginTop: "40px",
            paddingTop: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: "#888",
              fontSize: "12px"
            }}
          >
            © 2025 Mercedes-Benz Vietnam. Tất cả các quyền được bảo lưu.
          </Typography>

          <Box sx={{ display: "flex", gap: 3 }}>
            <Button
              sx={{
                color: "#888",
                fontSize: "12px",
                textTransform: "none",
                minWidth: "auto",
                padding: 0,
                "&:hover": {
                  backgroundColor: "transparent",
                  color: "white"
                },
              }}
            >
              Chính sách bảo mật
            </Button>
            <Button
              sx={{
                color: "#888",
                fontSize: "12px",
                textTransform: "none",
                minWidth: "auto",
                padding: 0,
                "&:hover": {
                  backgroundColor: "transparent",
                  color: "white"
                },
              }}
            >
              Điều khoản sử dụng
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
