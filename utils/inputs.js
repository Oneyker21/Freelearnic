import React from 'react';
import { TextInput, TouchableOpacity, StyleSheet, View, Text, Image } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Componente personalizado para entradas de texto con opción de mostrar/ocultar contraseña
export const CustomTextInput = ({ value, onChangeText, placeholder, secureTextEntry = false, showPassword, toggleShowPassword }) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.input}
      onChangeText={onChangeText}
      value={value}
      placeholder={placeholder}
      placeholderTextColor="#fff"
      secureTextEntry={secureTextEntry && !showPassword}
    />
    {secureTextEntry && (
      <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeIcon}>
        <Icon name={showPassword ? "eye" : "eye-slash"} size={20} color="#fff" />
      </TouchableOpacity>
    )}
  </View>
);

// Componente personalizado para botones que activan la selección de imágenes
export const ImagePickerButton = ({ onPress, iconName, buttonText }) => (
  <TouchableOpacity style={styles.imageButton} onPress={onPress}>
    <Icon name={iconName} size={20} color="#fff" style={styles.icon} />
    <Text style={styles.imageButtonText}>{buttonText}</Text>
  </TouchableOpacity>
);

// Componente para mostrar una imagen previa seleccionada
export const PreviewImage = ({ uri }) => (
  uri ? <Image source={{ uri }} style={styles.previewImage} /> : null
);

// Estilos para los componentes
const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#fff',
    marginBottom: 25,
    width: '100%',
    height: 40,
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
    color: '#fff',
  },
  eyeIcon: {
    padding: 10,
  },
  imageButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginRight: 5,
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  previewImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 5,
  },
});
