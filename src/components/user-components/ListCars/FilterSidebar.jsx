import React from 'react';
import {
    Paper,
    Typography,
    Button,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Divider,
    Stack,
    Chip
} from '@mui/material';
import {
    ExpandMore,
    DirectionsCar
} from '@mui/icons-material';

const FilterSidebar = ({
    selectedPriceRanges,
    selectedCategory,
    selectedTransmission,
    selectedFuelTypes,
    categories,
    onPriceRangeChange,
    onCategoryChange,
    onTransmissionChange,
    onFuelTypeChange,
    onClearFilters
}) => {
    const priceRanges = [
        '< 1.000.000.000₫',
        '1.000.000.000₫ - 1.500.000.000₫',
        '1.500.000.000₫ - 2.000.000.000₫',
        '2.000.000.000₫ - 3.000.000.000₫',
        '3.000.000.000₫ - 5.000.000.000₫',
        '5.000.000.000₫ - 8.000.000.000₫',
        '8.000.000.000₫ - 12.000.000.000₫',
        '> 12.000.000.000₫'
    ];

    const gearShifts = ['Số tự động', 'Số tay'];
    const fuelTypes = ['Xăng', 'Diesel', 'Hybrid', 'Điện'];

    return (
        <Paper
            sx={{
                p: 3,
                backgroundColor: '#ffffffff',
                color: 'black',
                borderRadius: 2,
                height: 'fit-content',
                position: 'sticky',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
            }}
        >
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
                <Typography variant="h6" fontWeight={700} sx={{ color: 'black' }}>
                    BỘ LỌC
                </Typography>
                <Button
                    size="small"
                    sx={{
                        color: '#000000ff',
                        textTransform: 'none',
                        fontSize: '17px',
                        zIndex: 10,
                        position: 'relative'
                    }}
                    onClick={onClearFilters}
                >
                    Xóa bộ lọc
                </Button>
            </Box>
            <hr />

            {/* Price Range Filter */}
            <Accordion
                defaultExpanded
                sx={{
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    '&:before': { display: 'none' },
                    position: 'relative',
                    zIndex: 2
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMore sx={{ color: 'black' }} />}
                    sx={{ p: 0, minHeight: 'unset' }}
                >
                    <Typography fontWeight={600} sx={{ color: 'black', fontSize: '20px' }}>
                        KHUNG GIÁ
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0, pt: 2 }}>
                    <FormGroup>
                        {priceRanges.map((range) => (
                            <FormControlLabel
                                key={range}
                                control={
                                    <Checkbox
                                        checked={selectedPriceRanges.has(range) || false}
                                        onChange={() => onPriceRangeChange(range)}
                                        sx={{
                                            color: '#000000ff',
                                            '&.Mui-checked': { color: '#222222ff' }
                                        }}
                                        size='medium'
                                    />
                                }
                                label={
                                    <Typography sx={{ color: '#000000ff', fontSize: '16px' }}>
                                        {range}
                                    </Typography>
                                }
                            />
                        ))}
                    </FormGroup>
                </AccordionDetails>
            </Accordion>

            <Divider sx={{ my: 2, borderColor: '#333' }} />

            {/* Category Filter */}
            <Accordion
                defaultExpanded
                sx={{
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    '&:before': { display: 'none' }
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMore sx={{ color: 'black' }} />}
                    sx={{ p: 0, minHeight: 'unset' }}
                >
                    <Typography fontWeight={600} sx={{ color: 'black', fontSize: '20px' }}>
                        LOẠI XE
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0, pt: 2 }}>
                    <Stack spacing={1.5}>
                        {categories.map((category) => (
                            <Box
                                key={category.name}
                                display="flex"
                                alignItems="center"
                                sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                        '& .MuiTypography-root': {
                                            color: '#000000ff'
                                        }
                                    }
                                }}
                                onClick={() => onCategoryChange(category.name)}
                            >
                                <DirectionsCar sx={{
                                    fontSize: 25,
                                    color: selectedCategory === category.name ? '#000000ff' : '#666',
                                    mr: 2
                                }} />
                                <Typography sx={{
                                    color: selectedCategory === category.name ? '#000000ff' : '#666',
                                    fontSize: '17px',
                                    flex: 1
                                }}>
                                    {category.name}
                                </Typography>
                                {category.count > 0 && (
                                    <Chip
                                        label={category.count}
                                        size="small"
                                        sx={{
                                            backgroundColor: '#464646ff',
                                            color: '#ffffffff',
                                            height: 20,
                                            fontSize: '11px',
                                            minWidth: 24
                                        }}
                                    />
                                )}
                            </Box>
                        ))}
                    </Stack>
                </AccordionDetails>
            </Accordion>

            <Divider sx={{ my: 2, borderColor: '#333' }} />

            {/* Transmission Filter */}
            <Accordion
                sx={{
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    '&:before': { display: 'none' }
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMore sx={{ color: 'black' }} />}
                    sx={{ p: 0, minHeight: 'unset' }}
                >
                    <Typography fontWeight={600} sx={{ color: 'black', fontSize: '20px' }}>
                        CẦU SỐ
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0, pt: 2 }}>
                    <Stack spacing={1}>
                        {gearShifts.map((gear) => (
                            <FormControlLabel
                                key={gear}
                                control={
                                    <Checkbox
                                        checked={selectedTransmission.includes(gear) || false}
                                        onChange={() => onTransmissionChange(gear)}
                                        sx={{
                                            color: '#000000ff',
                                            '&.Mui-checked': { color: '#464646ff' }
                                        }}
                                        size="medium"
                                    />
                                }
                                label={
                                    <Typography sx={{ color: '#000000ff', fontSize: '16px' }}>
                                        {gear}
                                    </Typography>
                                }
                            />
                        ))}
                    </Stack>
                </AccordionDetails>
            </Accordion>

            <Divider sx={{ my: 2, borderColor: '#333' }} />

            {/* Fuel Type Filter */}
            <Accordion
                sx={{
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    '&:before': { display: 'none' }
                }}
            >
                <AccordionSummary
                    expandIcon={<ExpandMore sx={{ color: 'black' }} />}
                    sx={{ p: 0, minHeight: 'unset' }}
                >
                    <Typography fontWeight={600} sx={{ color: 'black', fontSize: '20px' }}>
                        LOẠI NHIÊN LIỆU
                    </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ p: 0, pt: 2 }}>
                    <Stack spacing={1}>
                        {fuelTypes.map((fuel) => (
                            <FormControlLabel
                                key={fuel}
                                control={
                                    <Checkbox
                                        checked={selectedFuelTypes.includes(fuel) || false}
                                        onChange={() => onFuelTypeChange(fuel)}
                                        sx={{
                                            color: '#000000ff',
                                            '&.Mui-checked': { color: '#464646ff' }
                                        }}
                                        size="medium"
                                    />
                                }
                                label={
                                    <Typography sx={{ color: '#000000ff', fontSize: '16px' }}>
                                        {fuel}
                                    </Typography>
                                }
                            />
                        ))}
                    </Stack>
                </AccordionDetails>
            </Accordion>
        </Paper>
    );
};

export default FilterSidebar;