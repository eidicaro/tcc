import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../paginas/header';
import Footer from '../paginas/footer';
import Sidebar from './sidebar';
import Loader from './loader.js';
import { useState, useEffect } from 'react';

const Cardapio = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return loading ? <Loader loading={true} /> : 
  <div>
    <Header />
    <Sidebar/>
    <div className='produtos'> 
    <Footer />
    </div>
  </div>;
};

export default Cardapio;
