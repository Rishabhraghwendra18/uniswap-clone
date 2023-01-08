import React from 'react'
import {Button} from "@mui/material";
import { alpha, styled } from '@mui/material/styles';

const CustomButton = styled(Button)(({ theme }) => ({
    'background-color':'transparent',
    'box-shadow':'none',
    color:'black',
    backgroundColor:'white',
    borderRadius:'3rem',
    padding:'8px 12px',
    '&:hover':{
        color:'white'
    }
}));

export default CustomButton