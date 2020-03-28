import React from 'react';
import classes from './UsernameInput.module.css';

// Material UI
import Input from '@material-ui/core/Input';
import { ThemeProvider } from '@material-ui/core/styles';
import { createMuiTheme } from '@material-ui/core/styles';

const materialTheme = createMuiTheme({
    palette: {
        primary: {
            500: '#CC00FF'
        }
    }
});

export default function UsernameInput(props) {
    return <ThemeProvider theme={materialTheme}>

        <h2 className='page-header'>
            What Is Your Instagram Handle?
        </h2>

        <div className='form-box'>
            <span className={classes.InputWrapper}>
                <Input type='text'
                value={props.username}
                onChange={e => props.updateUsername(e.target.value)}
                className={classes.Input}/>
                <span className={classes.AtSymbol}>@</span>
            </span>
            
            <button onClick={props.nextStage}>Submit</button>
        </div>
    </ThemeProvider>
}
