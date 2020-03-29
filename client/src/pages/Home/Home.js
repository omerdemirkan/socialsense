import React from 'react'
import classes from './Home.module.css';

import ScrollUpOnMount from '../../components/ScrollUpOnMount/ScrollUpOnMount';

function Home() {
    return <div>
        <ScrollUpOnMount/>
        <div className = {classes.TextBox}>
            <h1>Discover your audience</h1>
        </div> 
    </div> 
    
}

export default Home