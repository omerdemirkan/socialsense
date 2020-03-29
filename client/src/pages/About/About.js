import React from 'react';
import './About.module.css';

import ScrollUpOnMount from '../../components/ScrollUpOnMount/ScrollUpOnMount';

export default function About() {
    return <div>
        <ScrollUpOnMount/>
        <h1>The Socialsense Mission</h1>
        <p style = {{fontSize:"6vw", margin: "25px", color:"var(--medium)", textAlign: "center"}}>At Socialsense, we believe there is an easier way to grow your company by harnessing the power of hashtags. A more valuable, surefire way where more of your audience will customers. We're passionate about it, and our mission is to help people achieve the audience they deserve, and our mission starts with...</p>
        <p style = {{fontSize:"8vw", margin: "25px", color:"var(--accent)", textAlign: "center"}}>#you</p>
    </div>
}
