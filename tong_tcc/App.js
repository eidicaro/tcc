import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import "bootstrap/dist/css/bootstrap.min.css";



const Stack = createNativeStackNavigator();

import Header from './paginas/header.js'; // ajuste o caminho conforme a estrutura do seu projeto
import Footer from './paginas/footer.js';

const App = () => {
  return (
      <html className='html col-12'  lang="pt-br">
        
      <div >
            <Header />
            <main className="container mt-5 ">
              <h1>Bem-vindo ao Restaurante!</h1>
              <p>Delicie-se com os melhores pratos.</p>
            </main>
      </div>
      </html>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
