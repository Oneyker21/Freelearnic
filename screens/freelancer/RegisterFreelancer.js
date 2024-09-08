import React from 'react';
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importar los iconos

const url = 'https://ak.picdn.net/shutterstock/videos/1060308725/thumb/1.jpg';

const RegisterFreelancer = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [nombres, setNombres] = React.useState('');
  const [apellidos, setApellidos] = React.useState('');
  const [nombreUsuario, setNombreUsuario] = React.useState('');
  const [numCedula, setNumCedula] = React.useState('');
  const [profesion, setProfesion] = React.useState('');
  const [fotoCedulaFront, setFotoCedulaFront] = React.useState(null);
  const [fotoCedulaBack, setFotoCedulaBack] = React.useState(null);
  const [fotoPerfil, setFotoPerfil] = React.useState(null);

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

  const obtenerSiguienteId = async () => {
    const contadorRef = doc(db, 'contadores', 'freelancers');
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
    setProfesion('');
    setFotoCedulaFront(null);
    setFotoCedulaBack(null);
    setFotoPerfil(null);
  };

  const registrarFreelancer = async () => {
    try {
      const idUsuario = await obtenerSiguienteId();

      await setDoc(doc(db, 'Freelancer', `id_freelancer_${idUsuario}`), {
        id: idUsuario,
        nombres: nombres,
        apellidos: apellidos,
        nombre_usuario: nombreUsuario,
        email: email,
        password: password, // Nota: deberías hashear la contraseña antes de guardarla
        tipo_usuario: 'freelancer',
        estado_verificacion: false,
        fecha_registro: new Date().toISOString(),
        num_cedula: numCedula,
        foto_cedula_front: fotoCedulaFront,
        foto_cedula_back: fotoCedulaBack,
        foto_perfil: fotoPerfil,
        estado_usuario: 'activo',
        profesion: profesion,
      });

      console.log('Freelancer registrado con éxito');
      Alert.alert('Éxito', 'Freelancer registrado correctamente');

      limpiarCampos();
    } catch (error) {
      console.error('Error al registrar el freelancer: ', error);
      Alert.alert('Error', 'No se pudo registrar el freelancer');
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: url }} style={[styles.image, StyleSheet.absoluteFill]} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <BlurView intensity={90} tint="light" style={styles.blurContainer}>
          <View style={styles.login}>
            <Image source={require('../../assets/icon/favicon.png')} style={styles.logo} />
            <Text style={styles.title}>Registrarse como Freelancer</Text>
            <TextInput style={styles.input} onChangeText={(text) => setNombres(text)} value={nombres} placeholder="Nombres" />
            <TextInput style={styles.input} onChangeText={(text) => setApellidos(text)} value={apellidos} placeholder="Apellidos" />
            <TextInput style={styles.input} onChangeText={(text) => setNombreUsuario(text)} value={nombreUsuario} placeholder="Nombre de usuario" />
            <TextInput style={styles.input} onChangeText={(text) => setEmail(text)} value={email} placeholder="Correo Electrónico" />
            <TextInput style={styles.input} onChangeText={(text) => setPassword(text)} value={password} placeholder="Contraseña" secureTextEntry />
            <TextInput style={styles.input} onChangeText={(text) => setNumCedula(text)} value={numCedula} placeholder="Número de Cédula" />
            <TextInput style={styles.input} onChangeText={(text) => setProfesion(text)} value={profesion} placeholder="Profesión" />
            
            {/* Botones de selección de imagen con iconos de archivo y cámara */}
            <View style={styles.imageRow}>
              <TouchableOpacity style={styles.imageButton} onPress={() => pickImage(setFotoCedulaFront, false)}>
                <Icon name="file" size={20} color="#fff" style={styles.icon} />
                <Text style={styles.imageButtonText}>Cédula (Frente)</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => pickImage(setFotoCedulaFront, true)}>
                <Icon name="camera" size={25} color="#007AFF" />
              </TouchableOpacity>
            </View>
            {fotoCedulaFront && <Image source={{ uri: fotoCedulaFront }} style={styles.previewImage} />}

            <View style={styles.imageRow}>
              <TouchableOpacity style={styles.imageButton} onPress={() => pickImage(setFotoCedulaBack, false)}>
                <Icon name="file" size={20} color="#fff" style={styles.icon} />
                <Text style={styles.imageButtonText}>Cédula (Reverso)</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => pickImage(setFotoCedulaBack, true)}>
                <Icon name="camera" size={25} color="#007AFF" />
              </TouchableOpacity>
            </View>
            {fotoCedulaBack && <Image source={{ uri: fotoCedulaBack }} style={styles.previewImage} />}

            <View style={styles.imageRow}>
              <TouchableOpacity style={styles.imageButton} onPress={() => pickImage(setFotoPerfil, false)}>
                <Icon name="file" size={20} color="#fff" style={styles.icon} />
                <Text style={styles.imageButtonText}>Foto de Perfil</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => pickImage(setFotoPerfil, true)}>
                <Icon name="camera" size={25} color="#007AFF" />
              </TouchableOpacity>
            </View>
            {fotoPerfil && <Image source={{ uri: fotoPerfil }} style={styles.previewImage} />}

            <TouchableOpacity onPress={registrarFreelancer} style={styles.buttonRegister}>
              <Text style={styles.buttonTextRegister}>Registrarse como Freelancer</Text>
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
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
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

export default RegisterFreelancer;
