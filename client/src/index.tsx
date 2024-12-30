import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom'; // Импорт BrowserRouter
import './index.css';
import App from './App';
import Store from './store/store';
import AuthProvider from './provider/authProvider';

interface State {
  store: Store;
}

const store = new Store();
const Context = createContext<State>({ store });
export default Context;

const root = ReactDOM.createRoot(document.getElementById('root')!);

root.render(
  <Router>
    <Context.Provider value={{ store }}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </Context.Provider>
  </Router>,
);
