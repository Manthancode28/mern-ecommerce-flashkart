import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { SquadProvider } from './context/SquadContext'; // NEW IMPORT

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <Provider store={store}>
      {/* SquadProvider wrapped here to allow real-time sync across all routes */}
      <SquadProvider>
        <RouterProvider router={router}/>
      </SquadProvider>
    </Provider>
  // </React.StrictMode>
);

reportWebVitals();