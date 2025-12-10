import React from "react";
import {
  Box,
  Divider,
  InputAdornment,
  Paper,
  Popover,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import StarIcon from "@mui/icons-material/Star";

const SearchOverlay = ({
  open,
  anchorEl,
  searchTerm,
  onChange,
  onClose,
  suggestions = [],
  onViewAll = () => {},
}) => (
  <Popover
    open={open}
    anchorEl={anchorEl}
    onClose={onClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    transformOrigin={{ vertical: "top", horizontal: "center" }}
    slotProps={{
      paper: { elevation: 6, sx: { borderRadius: 2 } }
    }}
  >
    <Paper
      sx={{
        width: 450,
        maxWidth: "100%",
        minHeight: 90,
        p: 2.5,
        borderRadius: 2,
        boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
      }}
    >
      <Stack spacing={1.5}>
        <TextField
          fullWidth
          placeholder="Từ khóa tìm kiếm"
          value={searchTerm}
          onChange={(e) => onChange(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#777" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 1.5,
              backgroundColor: "#f7f7f7",
            },
          }}
        />
        <Typography sx={{ color: "#555", fontSize: 14 }}>
          Tìm kiếm theo loại xe, mẫu xe, mã cấu hình hoặc các phụ kiện, sản phẩm và thông tin khác
        </Typography>
        {suggestions.length > 0 && (
          <Paper
            variant="outlined"
            sx={{
              borderRadius: 2,
              overflow: "hidden",
              borderColor: "#e0e0e0",
            }}
          >
            {suggestions.map((item, idx) => (
              <Box key={item.id} sx={{ p: 2 }}>
                <Stack direction="row" spacing={2}>
                  <Box
                    component="img"
                    src={item.image}
                    alt={item.name}
                    sx={{
                      width: 64,
                      height: 48,
                      objectFit: "contain",
                      borderRadius: 1,
                      backgroundColor: "#f5f5f5",
                    }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 700, color: "#111" }}>
                      {item.name}
                    </Typography>
                    <Typography sx={{ color: "#555", fontSize: 13, lineHeight: 1.5 }}>
                      {(item.description || "").slice(0, 110)}
                      {(item.description || "").length > 110 ? "..." : ""}
                    </Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.5 }}>
                      <StarIcon sx={{ color: "#f5a623", fontSize: 18 }} />
                      <Typography sx={{ fontSize: 13, color: "#222" }}>
                        {item.rating ? item.rating.toFixed(1) : "4.5"} ({item.reviews || "120"} đánh giá)
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
                {idx < suggestions.length - 1 && <Divider sx={{ mt: 2 }} />}
              </Box>
            ))}
            <Box
              sx={{
                textAlign: "center",
                py: 2,
                backgroundColor: "#fafafa",
                cursor: "pointer",
                "&:hover": { backgroundColor: "#f0f0f0" },
              }}
              onClick={() => onViewAll(searchTerm)}
            >
              <Typography sx={{ color: "#000", fontWeight: 600 }}>
                Xem tất cả kết quả cho "{searchTerm}"
              </Typography>
            </Box>
          </Paper>
        )}
      </Stack>
    </Paper>
  </Popover>
);

export default SearchOverlay;

