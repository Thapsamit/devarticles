import React,{useEffect,useState} from 'react';
import Articles from '../Articles/Articles.js';
import Form from '../Form/Form.js';
import Pagination from '../Pagination.js';
import { useHistory, useLocation } from 'react-router-dom';

import {useDispatch} from 'react-redux';
import {getArticles, getArticlesBySearch} from '../../actions/articles.js';
function useQuery(){
    return new URLSearchParams(useLocation().search);
}
const Home = ()=>{
	const[currentId,setCurrentId] = useState(null);
    const[search,setSearch] = useState('')
    const history = useHistory();
    const query = useQuery();
    const searchQuery = query.get('searchQuery')
    const dispatch = useDispatch();
    const searchArticle = ()=>{
        if(search.trim()){
           dispatch(getArticlesBySearch({search}))
        }
        else{
            history.push('/')
        }
    }
    
    const handleKeyPress = (e)=>{
        if(e.which===13){
            console.log("Enter ")
            searchArticle()
        }
    }
    useEffect(()=>{
       dispatch(getArticles());
    },[dispatch])
           return(
        <section>
       <div className='box'>
             <div className="m-4">
                 <input name="search" type="text" className="w-full p-[12px]" placeholder='Search Articles...' onChange={(e)=>setSearch(e.target.value)} onKeyDown={handleKeyPress}/>
                 <button className ="btn" onClick={searchArticle}>Search</button>
             </div>
             <div className="block grid-cols-3 w-full md:grid  gap-2 mt-3">
                 <div className="col-start-1 col-end-3">
                     <Articles setCurrentId={setCurrentId}/>
                 </div>
                 <div className="my-3 mx-3">
                     <Form currentId={currentId} setCurrentId={setCurrentId}/>
                 </div>
             </div>
             <Pagination/>
       </div>
    </section>
           	)
}
export default Home