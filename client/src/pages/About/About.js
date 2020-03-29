import React from 'react';
import classes from './About.module.css';

export default function About() {
    return <div className = {classes.TextBox}>
        <h1>The Socialsense Mission</h1>
        <p style = {{fontSize:"6vw", margin: "25px", color:"var(--medium)", textAlign: "center"}}>At Socialsense, we believe there's an easier way to grow your company by harnessing the power of hashtags. A more valuable, surefire way where more of your audience will customers. We're passionate about it, and our mission is to help people achieve the audience they deserve, and our mission starts with...</p>
        <p style = {{fontSize:"8vw", margin: "25px", color:"var(--accent)", textAlign: "center"}}>#you</p>
    </div>
}
