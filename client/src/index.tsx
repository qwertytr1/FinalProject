import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Store from './store/store';

interface State {
  store: Store;
}

const store = new Store();
export const Context = createContext<State>({ store });

// Use ReactDOM.createRoot to render the app
const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <Context.Provider value={{ store }}>
    <App />
  </Context.Provider>
);