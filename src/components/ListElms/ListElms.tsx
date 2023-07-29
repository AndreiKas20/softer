import React, {useEffect, useState} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import {itemConstructArr} from "../../App";
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import styles from './ListElms.module.scss'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface IListItem {
    listFiles: itemConstructArr[]
}

const ListItems = ({listFiles}: IListItem) => {
    const [arr, setArr] = useState(listFiles)

    useEffect(() => {
        setArr(listFiles)
    }, [listFiles])
    return (
           <Container maxWidth="sm">
               <Box sx={{bgcolor: '#cfe8fc', borderRadius: '18px', padding: '25px'}}>
                   <List sx={{width: '100%', maxWidth: 660, bgcolor: 'none'}}>
                       {arr.map(({id, file, state}) => (
                           <ListItem
                               className={styles.item}
                               key={id}
                               disableGutters
                               secondaryAction={
                                   <IconButton aria-label="comment">
                                       {
                                           state === 'load' && <CircularProgress sx={{height: '50%'}} />
                                       }
                                       {
                                           state === 'finish' && <CheckCircleOutlineIcon fontSize={'large'} color={'success'}/>
                                       }
                                       {
                                           state === 'wait' && <HourglassEmptyIcon fontSize={'large'} color={'warning'}/>
                                       }
                                       {
                                           state === 'err' && <ErrorOutlineIcon fontSize={'large'} color={'error'}/>
                                       }
                                   </IconButton>
                               }
                           >
                               <ListItemText sx={{color: '#448f88', fontSize: '28px'}} primary={`Наименование файла: ${file.name}`}/>
                           </ListItem>
                       ))}
                   </List>
               </Box>
           </Container>
    );
};

export default ListItems;
