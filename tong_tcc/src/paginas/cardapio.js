import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './paginas/header.js';
import Footer from './paginas/footer.js';
import AppRoutes from '../assets/router.js';

const App = () => {
  return (
    <AppRoutes>
            <div>
              <Header />
              <Footer />
            </div>
    </AppRoutes>
  );
};

export default App;
