import React from 'react';
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';

const url = 'https://ak.picdn.net/shutterstock/videos/1060308725/thumb/1.jpg';

const RegisterUsers = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [nombres, setNombres] = React.useState('');
  const [apellidos, setApellidos] = React.useState('');
  const [nombreUsuario, setNombreUsuario] = React.useState('');
  const [numCedula, setNumCedula] = React.useState('');
  const [municipio, setMunicipio] = React.useState('');
  const [departamento, setDepartamento] = React.useState('');
  const [tipoUsuario, setTipoUsuario] = React.useState('');
  const [fotoCedulaFront, setFotoCedulaFront] = React.useState(null);
  const [fotoCedulaBack, setFotoCedulaBack] = React.useState(null);
  const [fotoPerfil, setFotoPerfil] = React.useState(null);

  const auth = getAuth();
  const navigation = useNavigation();

  const pickImage = async (setImageFunction, useCamera = false) => {
    // Solicitar permisos para acceder a la cámara
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se requieren permisos de cámara para tomar fotos.');
      return;
    }

    let result;
    if (useCamera) {
      // Abrir la cámara
      result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
    } else {
      // Abrir la galería
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

  const obtenerSiguienteId = async () => {
    const contadorRef = doc(db, 'contadores', 'usuarios');
    const contadorDoc = await getDoc(contadorRef);

    if (!contadorDoc.exists()) {
      await setDoc(contadorRef, { contador: 1 });
      return 1;
    } else {
      const nuevoContador = contadorDoc.data().contador + 1;
      await updateDoc(contadorRef, { contador: increment(1) });
      return nuevoContador;
    }
  };

  const limpiarCampos = () => {
    setEmail('');
    setPassword('');
    setNombres('');
    setApellidos('');
    setNombreUsuario('');
    setNumCedula('');
    setMunicipio('');
    setDepartamento('');
    setTipoUsuario('');
    setFotoCedulaFront(null);
    setFotoCedulaBack(null);
    setFotoPerfil(null);
  };

  const registrarUsuario = async () => {
    try {
      const idUsuario = await obtenerSiguienteId();

      await setDoc(doc(db, 'Usuario', `id_usuario_${idUsuario}`), {
        id: idUsuario,
        nombres: nombres,
        apellidos: apellidos,
        nombre_usuario: nombreUsuario,
        email: email,
        passwor: password,
        tipo_usuario: 'cliente',
        estado_verificacion: false,
        fecha_registro: new Date().toISOString(),
        num_cedula: numCedula,
        foto_cedula_fron: fotoCedulaFront,
        foto_cedula_back: fotoCedulaBack,
        foto_perfil: fotoPerfil,
        estado_usuario: 'activo',
        fecha_suspension: null,
        tipo_suspension: null,
        municipio: municipio,
        departamento: departamento,
      });

      console.log('Usuario registrado con éxito');
      Alert.alert('Éxito', 'Usuario registrado correctamente');
      limpiarCampos();
    } catch (error) {
      console.error('Error al registrar el usuario: ', error);
      Alert.alert('Error', 'No se pudo registrar el usuario');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: url }} style={[styles.image, StyleSheet.absoluteFill]} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <BlurView intensity={90} tint="light" style={styles.blurContainer}>
          <View style={styles.login}>
            <Image source={require('../assets/icon/favicon.png')} style={styles.logo} />
            <Text style={styles.title}>Registrarse</Text>
            <TextInput style={styles.input} onChangeText={setNombres} value={nombres} placeholder="Nombres" />
            <TextInput style={styles.input} onChangeText={setApellidos} value={apellidos} placeholder="Apellidos" />
            <TextInput style={styles.input} onChangeText={setNombreUsuario} value={nombreUsuario} placeholder="Nombre de usuario" />
            <TextInput style={styles.input} onChangeText={setEmail} value={email} placeholder="Correo Electrónico" />
            <TextInput style={styles.input} onChangeText={setPassword} value={password} placeholder="Contraseña" secureTextEntry />
            <TextInput style={styles.input} onChangeText={setNumCedula} value={numCedula} placeholder="Número de Cédula" />
            <TextInput style={styles.input} onChangeText={setMunicipio} value={municipio} placeholder="Municipio" />
            <TextInput style={styles.input} onChangeText={setDepartamento} value={departamento} placeholder="Departamento" />

            {/* Botones para seleccionar imagen de la galería o la cámara */}
            <TouchableOpacity style={styles.imageButton} onPress={() => pickImage(setFotoCedulaFront, false)}>
              <Text style={styles.imageButtonText}>Seleccionar Foto Cédula (Frente) de la Galería</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageButton} onPress={() => pickImage(setFotoCedulaFront, true)}>
              <Text style={styles.imageButtonText}>Tomar Foto Cédula (Frente) con Cámara</Text>
            </TouchableOpacity>
            {fotoCedulaFront && <Image source={{ uri: fotoCedulaFront }} style={styles.previewImage} />}
            
            <TouchableOpacity style={styles.imageButton} onPress={() => pickImage(setFotoCedulaBack, false)}>
              <Text style={styles.imageButtonText}>Seleccionar Foto Cédula (Reverso) de la Galería</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageButton} onPress={() => pickImage(setFotoCedulaBack, true)}>
              <Text style={styles.imageButtonText}>Tomar Foto Cédula (Reverso) con Cámara</Text>
            </TouchableOpacity>
            {fotoCedulaBack && <Image source={{ uri: fotoCedulaBack }} style={styles.previewImage} />}
            
            <TouchableOpacity style={styles.imageButton} onPress={() => pickImage(setFotoPerfil, false)}>
              <Text style={styles.imageButtonText}>Seleccionar Foto de Perfil de la Galería</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.imageButton} onPress={() => pickImage(setFotoPerfil, true)}>
              <Text style={styles.imageButtonText}>Tomar Foto de Perfil con Cámara</Text>
            </TouchableOpacity>
            {fotoPerfil && <Image source={{ uri: fotoPerfil }} style={styles.previewImage} />}

            <TouchableOpacity onPress={registrarUsuario} style={styles.buttonRegister}>
              <Text style={styles.buttonTextRegister}>Registrarse</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  blurContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  login: {
    width: '100%',
    alignItems: 'center',
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 4,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonRegister: {
    width: '100%',
    height: 40,
    backgroundColor: '#E6F3FF',
    borderRadius: 5,
    borderColor: '#007AFF',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextRegister: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  imageButton: {
    width: '100%',
    height: 40,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  previewImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default RegisterUsers;
