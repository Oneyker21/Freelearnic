import React, { useState, useEffect } from 'react';
import MainNavigator from './navigation/MainNavigator';
import * as Font from 'expo-font';

const App = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Roboto-regular': require('./fonts/Roboto-Regular.ttf'),
        'OpenSans-regular': require('./fonts/OpenSans-Regular.ttf'),
      });
      setFontsLoaded(true);
    }

    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return null; // O muestra algún tipo de pantalla de carga
  }

  return (
      <MainNavigator></MainNavigator>
  );
};

export default App;



