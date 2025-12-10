import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import SearchIcon from "@mui/icons-material/Search";
import LanguageIcon from "@mui/icons-material/Language";
import { useNavigate } from "react-router-dom";

const HeaderAuth = () => {
    const menus = ["Đăng nhập", "Đăng ký"];

    const navigate = useNavigate();

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: "#000000",
                boxShadow: "none",
                height: "100px",
            }}
        >
            <Toolbar
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: "100%",
                    px: { xs: 2, md: 15 },
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        gap: { xs: 2, md: 4 },
                        flex: 1,
                        justifyContent: "flex-start"
                    }}
                >
                    {menus.map((item, index) => (
                        <Button
                            key={index}
                            sx={{
                                color: "white",
                                fontSize: "18px",
                                fontWeight: 400,
                                textTransform: "none",
                                minWidth: "auto",
                                padding: "6px 8px",
                                transition: "color 0.2s ease",
                                "&:hover": {
                                    backgroundColor: "transparent",
                                    color: "#cccccc"
                                },
                            }}
                            onClick={() => {
                                if (item === "Đăng nhập") navigate("/dang-nhap");
                                if (item === "Đăng ký") navigate("/dang-ky");
                            }}
                        >
                            {item}
                        </Button>
                    ))}
                </Box>

                <Box
                    sx={{
                        flex: 1,
                        display: "flex",
                        justifyContent: "center"
                    }}
                >
                    <img
                        src="../../../public/proj_images/logo/logo.png"
                        alt="Mercedes-Benz Logo"
                        onClick={() => window.location.href = '/'}
                        style={{
                            height: 90,
                            width: "auto",
                            objectFit: "contain",
                            cursor: "pointer"
                        }}
                    />
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        flex: 1,
                        justifyContent: "flex-end"
                    }}
                >
                    <IconButton
                        sx={{
                            color: "white",
                            "&:hover": { color: "#cccccc" }
                        }}
                    >
                        <SearchIcon />
                    </IconButton>

                    
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default HeaderAuth;
