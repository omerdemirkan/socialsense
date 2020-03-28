import React from 'react';
import classes from './Search.module.css';

// Stages
import UsernameInput from './Stages/UsernameInput/UsernameInput';
import FilesSelection from './Stages/FilesSelection/FilesSelection';

export default function Search() {
    return <div>
        <UsernameInput/>
        <FilesSelection/>
    </div>
}
