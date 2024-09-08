import React from 'react';
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';

const url = 'https://ak.picdn.net/shutterstock/videos/1060308725/thumb/1.jpg';

const RegisterFreelancer = () => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [nombres, setNombres] = React.useState('');
  const [apellidos, setApellidos] = React.useState('');
  const [nombreUsuario, setNombreUsuario] = React.useState('');
  const [numCedula, setNumCedula] = React.useState('');
  const [profesion, setProfesion] = React.useState('');
  const [fotoPerfil, setFotoPerfil] = React.useState(null);

  const auth = getAuth();
  const navigation = useNavigation();

  // ... funciones auxiliares (pickImage, obtenerSiguienteId, limpiarCampos) ...

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
            
            <TouchableOpacity style={styles.imageButton} onPress={() => pickImage(setFotoPerfil)}>
              <Text style={styles.imageButtonText}>Seleccionar Foto de Perfil</Text>
            </TouchableOpacity>
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

export default RegisterFreelancer;
