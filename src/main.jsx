import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx';
import { store } from './store.js';

import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    // action: appAction,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
