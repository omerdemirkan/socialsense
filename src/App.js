import React from 'react';
import './App.css';
import { Layout, Header, Navigation, Drawer, Content} from 'react-mdl'
import Main from './components/main';
import {Link} from 'react-router-dom'

function App() {
  return (
<div style={{height: '1000px', position: 'relative'}}>
    <Layout fixedHeader>
        <Header className="header-color" title = "Social Sense" scroll>
            <Navigation>
                <Link to="/">Try It</Link>
                <Link to="/about">About</Link>
                <Link to="/">Contact</Link>
            </Navigation>
        </Header>
        <Drawer title="Title">
            <Navigation style = {{backgroundColor:"transparent"}}>
                <a href="#">Link</a>
                <a href="#">Link</a>
                <a href="#">Link</a>
                <a href="#">Link</a>
            </Navigation>
        </Drawer>
        <Content>
          <div className="page-content"/>
          <Main />
        </Content>
    </Layout>
</div>
  );
}

export default App;
