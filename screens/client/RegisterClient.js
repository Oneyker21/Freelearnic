import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { CustomTextInput, ImagePickerButton, PreviewImage } from '../../utils/inputs'; // Asegúrate de que la ruta sea correcta

const RegisterUsers = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [numCedula, setNumCedula] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [fotoCedulaFront, setFotoCedulaFront] = useState(null);
  const [fotoCedulaBack, setFotoCedulaBack] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
    } else {
      setError('');
    }
  }, [password, confirmPassword]);

  const auth = getAuth();
  const navigation = useNavigation();

  const pickImage = async (setImageFunction, useCamera = false) => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se requieren permisos de cámara para tomar fotos.');
      return;
    }

    let result;
    if (useCamera) {
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    }

    if (!result.canceled) {
      setImageFunction(result.assets[0].uri);
    }
  };


  const limpiarCampos = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setNombres('');
    setApellidos('');
    setNombreUsuario('');
    setNumCedula('');
    setMunicipio('');
    setDepartamento('');
    setFotoCedulaFront(null);
    setFotoCedulaBack(null);
    setFotoPerfil(null);
  };

  const registrarUsuario = async () => {
    try {
      if (password !== confirmPassword) {
        Alert.alert('Error', 'Las contraseñas no coinciden');
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const idCliente = `id_cliente_${user.uid}`;

      await setDoc(doc(db, 'Clientes', idCliente), {
        uid: user.uid,
        id: idCliente,
        nombres,
        apellidos,
        nombre_usuario: nombreUsuario,
        email,
        tipo_usuario: 'cliente',
        estado_verificacion: false,
        fecha_registro: new Date().toISOString(),
        num_cedula: numCedula,
        foto_cedula_front: fotoCedulaFront,
        foto_cedula_back: fotoCedulaBack,
        foto_perfil: fotoPerfil,
        estado_usuario: 'activo',
        municipio,
        departamento,
      });

      console.log('Usuario registrado con éxito');
      Alert.alert('Éxito', 'Usuario registrado correctamente', [
        {
          text: 'OK',
          onPress: () => {
            limpiarCampos();
            navigation.replace('Login');
          }
        }
      ]);
    } catch (error) {
      console.error('Error al registrar el usuario: ', error);
      Alert.alert('Error', 'No se pudo registrar el usuario: ' + error.message);
    } 
  };

  return (
    <View style={styles.container}>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={30} color="#15297C" />
          </TouchableOpacity>
          <Image source={require('../../assets/Freelearnic.png')} style={styles.logo} />
          <View style={styles.containerView}>
            <View style={styles.login}>
              <Text style={styles.title}>
                Crear una cuenta de <Text style={{ fontWeight: 'bold' }}>Freelearnic</Text>
              </Text>
              <CustomTextInput onChangeText={setNombres} value={nombres} placeholder="Nombres" />
              <CustomTextInput onChangeText={setApellidos} value={apellidos} placeholder="Apellidos" />
              <CustomTextInput onChangeText={setNombreUsuario} value={nombreUsuario} placeholder="Nombre de usuario" />
              <CustomTextInput onChangeText={setEmail} value={email} placeholder="Correo Electrónico" />
              <CustomTextInput onChangeText={setPassword} value={password} placeholder="Contraseña" secureTextEntry={true} showPassword={showPassword} toggleShowPassword={() => setShowPassword(!showPassword)} />
              <CustomTextInput onChangeText={setConfirmPassword} value={confirmPassword} placeholder="Confirmar Contraseña" secureTextEntry={true} />
              <View style={styles.errorContainer}>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>
              <CustomTextInput onChangeText={setNumCedula} value={numCedula} placeholder="Número de Cédula" />
              <CustomTextInput onChangeText={setMunicipio} value={municipio} placeholder="Municipio" />
              <CustomTextInput onChangeText={setDepartamento} value={departamento} placeholder="Departamento" />

              <ImagePickerButton onPress={() => pickImage(setFotoCedulaFront, false)} iconName="id-card-o" buttonText="Cédula (Frente)" />
              <PreviewImage uri={fotoCedulaFront} />
              <ImagePickerButton onPress={() => pickImage(setFotoCedulaBack, false)} iconName="id-card-o" buttonText="Cédula (Reverso)" />
              <PreviewImage uri={fotoCedulaBack} />
              <ImagePickerButton onPress={() => pickImage(setFotoPerfil, false)} iconName="user-circle-o" buttonText="Foto de Perfil" />
              <PreviewImage uri={fotoPerfil} />

              <TouchableOpacity onPress={registrarUsuario} style={styles.buttonRegister}>
                <Text style={styles.buttonTextRegister}>Registrarse</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    position: 'relative',
  },
  scrollView: {
    zIndex: 0,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  scrollViewContent: {
    paddingTop: 60,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerView: {
    backgroundColor: '#107acc',
    width: '100%',
    padding: 30,
    borderTopLeftRadius: 130,
    overflow: 'hidden',
  },
  login: {
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 130,
    borderRadius: 4,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'normal',
    marginBottom: 20,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowRadius: 1,
  },
  buttonRegister: {
    width: '100%',
    height: 40,
    backgroundColor: '#15297C',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextRegister: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  errorContainer: {
    width: '100%',
    alignItems: 'flex-end',
  },
  errorText: {
    color: '#ffff',
    fontSize: 14,
    marginTop: 5,
    fontWeight: 'bold',
    backgroundColor: null,
  },
});

export default RegisterUsers;
