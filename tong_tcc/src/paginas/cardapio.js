import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../paginas/header';
import Footer from '../paginas/footer';
import Sidebar from './sidebar';



const Cardapio = () => {
  return (
    <div>
      <Header />
      <Sidebar/>
      <div className='produtos'>
      
      <Footer />
      </div>
    </div>
  );
};

export default Cardapio;
