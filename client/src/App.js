import React from 'react';
import Home from './components/Home/Home.js'
import Navbar from './components/Navbar/Navbar.js'
import Auth from './components/Auth/Auth.js'
import WriteArticle from './components/WriteArticle/WriteArticle.js';
import PostDetails from './components/PostDetails/PostDetails.js';

import { BrowserRouter, Switch, Route,Redirect } from 'react-router-dom';

const App = ()=>{
   
   const user = JSON.parse(localStorage.getItem('profile'));
   console.log(user)
    return(
        <>
     <BrowserRouter>
      <Navbar/>
      <Switch>
         <Route path="/" exact component = {()=><Redirect to="/articles"/>} />
         <Route path ="/articles" exact component = {Home}/>
         <Route path="/articles/search" exact component = {Home}/>
         <Route path="/articles/categories" exact component = {Home}/>
         <Route path = "/articles/:id" exact component = {PostDetails}/>
         <Route path='/auth'  exact component={()=>(!user ? <Auth/>: <Redirect to ="/articles"/>)}/>
         <Route path="/writeArticle" component={WriteArticle}/>
         <Route path="/editArticle/:id" component={WriteArticle}/>
         <Route path="/bookmarks" component={Home}/>
      </Switch>
     
     </BrowserRouter>   
    
       
        
        </>
    )
}
export default App