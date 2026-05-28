import React, { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import AppRoutes from './routes/AppRoutes';
import IntroScreen from './pages/IntroScreen';

export default function App() {
  const [ready, setReady] = useState(
    () => localStorage.getItem('dhara_intro_shown') === 'true'
  );

  if (!ready) {
    return (
      <Provider store={store}>
        <IntroScreen onFinish={() => {
          localStorage.setItem('dhara_intro_shown', 'true');
          setReady(true);
        }} />
      </Provider>
    );
  }

  return (
    <Provider store={store}>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </Provider>
  );
}
