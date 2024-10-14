import React from 'react';
import { Text, StyleSheet } from 'react-native';

const CustomText = ({ children, style, fontType = 'regular', fontFamily = 'OpenSans', ...props }) => {
  // Determina la fuente a usar
  const selectedFont = fontFamily === 'Roboto' ? (fontType === 'bold' ? 'Roboto-bold' : 'Roboto-regular') : (fontType === 'bold' ? 'OpenSans-bold' : 'OpenSans-regular');

  return (
    <Text style={[styles.text, { fontFamily: selectedFont }, style]} {...props}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16, // Tamaño de fuente por defecto
  },
});

export default CustomText;

