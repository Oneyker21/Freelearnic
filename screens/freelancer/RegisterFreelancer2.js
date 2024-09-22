import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, CheckBox, Alert } from 'react-native';
import { CustomTextInput, ImagePickerButton, PreviewImage } from '../../utils/inputs';
import { useNavigation } from '@react-navigation/native';

const RegisterStepTwo = ({ route }) => {
  const navigation = useNavigation();
  const { nombres, apellidos, nombreUsuario, email, password, numCedula } = route.params;

  const [profesion, setProfesion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [fotoCedulaFront, setFotoCedulaFront] = useState(null);
  const [fotoCedulaBack, setFotoCedulaBack] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const pickImage = async (setImageFunction, useCamera = false) => {
    // Código para seleccionar imágenes de la galería o cámara
  };

  const onRegister = () => {
    if (!acceptedTerms) {
      Alert.alert('Error', 'Debes aceptar los términos y condiciones para continuar');
      return;
    }

    // Lógica para registrar el usuario con todos los datos
    console.log({
      nombres, apellidos, nombreUsuario, email, password, numCedula,
      profesion, ciudad, departamento, fotoCedulaFront, fotoCedulaBack, fotoPerfil
    });

    // Aquí puedes navegar o hacer alguna acción tras el registro
  };

  return (
    <View style={styles.container}>
      <CustomTextInput onChangeText={setProfesion} value={profesion} placeholder="Profesión" />
      <CustomTextInput onChangeText={setCiudad} value={ciudad} placeholder="Ciudad" />
      <CustomTextInput onChangeText={setDepartamento} value={departamento} placeholder="Departamento" />

      <ImagePickerButton onPress={() => pickImage(setFotoCedulaFront, false)} iconName="id-card-o" buttonText="Cédula (Frente)" />
      <PreviewImage uri={fotoCedulaFront} />
      <ImagePickerButton onPress={() => pickImage(setFotoCedulaBack, false)} iconName="id-card-o" buttonText="Cédula (Reverso)" />
      <PreviewImage uri={fotoCedulaBack} />
      <ImagePickerButton onPress={() => pickImage(setFotoPerfil, false)} iconName="user-circle-o" buttonText="Foto de Perfil" />
      <PreviewImage uri={fotoPerfil} />

      <View style={styles.termsContainer}>
        <CheckBox value={acceptedTerms} onValueChange={setAcceptedTerms} />
        <Text style={styles.termsText}>Acepto los términos y condiciones</Text>
      </View>

      <TouchableOpacity onPress={onRegister} style={styles.button}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#15297C',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  termsText: {
    marginLeft: 10,
  },
});

export default RegisterStepTwo;
