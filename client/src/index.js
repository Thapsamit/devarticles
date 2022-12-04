import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {Provider} from 'react-redux'
import {createStore,applyMiddleware,compose} from 'redux'
import thunk from 'redux-thunk'
import { reducers } from './reducers'
import { GoogleOAuthProvider } from '@react-oauth/google';


/*,window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()*/
const store = createStore(reducers,compose(applyMiddleware(thunk)))
const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
<Provider store = {store}>
<GoogleOAuthProvider clientId="380779910907-j7gehna03igrdmfc91l7vs8ujdpm105m.apps.googleusercontent.com">
      <App/>
</GoogleOAuthProvider>
</Provider>
);