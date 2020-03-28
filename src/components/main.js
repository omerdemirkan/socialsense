import React from 'react'
import LandingPage from './landingpage'
import About from './about'
import { Switch, Route } from 'react-router-dom'

const Main = () => (
    <Switch>
        <Route exact path ="/" component = {LandingPage} />
        <Route path ="/about" component = {About} />
    </Switch>
)

export default Main