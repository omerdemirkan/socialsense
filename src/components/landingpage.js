import React, { Component } from 'react';
import { Cell, Grid } from 'react-mdl';

class LandingPage extends Component {
    render() {
        return(
            <div style = {{width:"100%", margin:"auto"}}>
                <Grid className="landing-grid">
                    <Cell col={12}>
                        <div className="banner-text">
                        Discover your audience
                        </div>
                        
                    </Cell>
                </Grid>
            </div>
        )
    }
}
export default LandingPage