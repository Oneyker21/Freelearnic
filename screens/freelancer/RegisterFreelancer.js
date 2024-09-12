import React, { useState } from 'react';
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de importar Ionicons

const RegisterFreelancer = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [numCedula, setNumCedula] = useState('');
  const [profesion, setProfesion] = useState('');
  const [fotoCedulaFront, setFotoCedulaFront] = useState(null);
  const [fotoCedulaBack, setFotoCedulaBack] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

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
    try {
      const contadorRef = doc(db, 'contadores', 'freelancers');
      const contadorDoc = await getDoc(contadorRef);

      if (!contadorDoc.exists()) {
        await setDoc(contadorRef, { contador: 1 });
        return 'id_freelancer_1';
      } else {
        const data = contadorDoc.data();
        if (data && typeof data.contador === 'number') {
          const nuevoContador = data.contador + 1;
          await updateDoc(contadorRef, { contador: increment(1) });
          return `id_freelancer_${nuevoContador}`;
        } else {
          console.error('El documento del contador no tiene el formato esperado');
          throw new Error('Error al obtener el siguiente ID');
        }
      }
    } catch (error) {
      console.error('Error al obtener el siguiente ID:', error);
      throw error;
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
      // Crear el usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Obtener el siguiente ID en el formato deseado
      const idFreelancer = await obtenerSiguienteId();

      // Guardar los datos adicionales en Firestore usando el nuevo ID
      await setDoc(doc(db, 'Freelancer', idFreelancer), {
        uid: user.uid, // Guardamos el UID de Authentication para referencia
        id: idFreelancer,
        nombres: nombres,
        apellidos: apellidos,
        nombre_usuario: nombreUsuario,
        email: email,
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
      Alert.alert(
        'Éxito',
        'Freelancer registrado correctamente',
        [
          {
            text: 'OK',
            onPress: () => {
              limpiarCampos();
              navigation.replace('Inicio de sesión');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error al registrar el freelancer: ', error);
      Alert.alert('Error', 'No se pudo registrar el freelancer: ' + error.message);
    }
  };
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={30} color="#15297C" />
      </TouchableOpacity>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
       
        <Image source={require('../../assets/Freelearnic.png')} style={styles.logo} />
        <View style={styles.containerView}>
          <View style={styles.login}>

            <Text style={styles.title}>
              Crear una cuenta de <Text style={{ fontWeight: 'bold' }}>Freelearnic</Text>
            </Text>
            <TextInput style={styles.input} onChangeText={(text) => setNombres(text)} value={nombres} placeholder="Nombres" placeholderTextColor="#fff" />
            <TextInput style={styles.input} onChangeText={(text) => setApellidos(text)} value={apellidos} placeholder="Apellidos" placeholderTextColor="#fff" />
            <TextInput style={styles.input} onChangeText={(text) => setNombreUsuario(text)} value={nombreUsuario} placeholder="Nombre de usuario" placeholderTextColor="#fff" />
            <TextInput style={styles.input} onChangeText={setEmail} value={email} placeholder="Correo Electrónico" placeholderTextColor="#fff" />
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                onChangeText={setPassword}
                value={password}
                placeholder="Contraseña"
                placeholderTextColor="#fff"
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Icon name={showPassword ? "eye" : "eye-slash"} size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <TextInput style={styles.input} onChangeText={(text) => setNumCedula(text)} value={numCedula} placeholder="Número de Cédula" placeholderTextColor="#fff" />
            <TextInput style={styles.input} onChangeText={(text) => setProfesion(text)} value={profesion} placeholder="Profesión" placeholderTextColor="#fff" />

            {/* Botones de selección de imagen con iconos */}
            <View style={styles.imageRow}>
              <TouchableOpacity style={styles.imageButton} onPress={() => pickImage(setFotoCedulaFront, false)}>
                <Icon name="id-card-o" size={20} color="#fff" style={styles.icon} />
                <Text style={styles.imageButtonText}>Cédula (Frente)</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => pickImage(setFotoCedulaFront, true)}>
                <Icon name="camera" size={25} color="#fff" />
              </TouchableOpacity>
            </View>
            {fotoCedulaFront && <Image source={{ uri: fotoCedulaFront }} style={styles.previewImage} />}

            <View style={styles.imageRow}>
              <TouchableOpacity style={styles.imageButton} onPress={() => pickImage(setFotoCedulaBack, false)}>
                <Icon name="id-card-o" size={20} color="#fff" style={styles.icon} />
                <Text style={styles.imageButtonText}>Cédula (Reverso)</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => pickImage(setFotoCedulaBack, true)}>
                <Icon name="camera" size={25} color="#fff" />
              </TouchableOpacity>
            </View>
            {fotoCedulaBack && <Image source={{ uri: fotoCedulaBack }} style={styles.previewImage} />}

            <View style={styles.imageRow}>
              <TouchableOpacity style={styles.imageButton} onPress={() => pickImage(setFotoPerfil, false)}>
                <Icon name="user-circle-o" size={20} color="#fff" style={styles.icon} />
                <Text style={styles.imageButtonText}>Foto de Perfil</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => pickImage(setFotoPerfil, true)}>
                <Icon name="camera" size={25} color="#fff" />
              </TouchableOpacity>
            </View>
            {fotoPerfil && <Image source={{ uri: fotoPerfil }} style={styles.previewImage} />}

            <TouchableOpacity onPress={registrarFreelancer} style={styles.buttonRegister}>
              <Text style={styles.buttonTextRegister}>Siguiente</Text>
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
    backgroundColor: '#388ABD',
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
    fontWeight: 'none',
    marginBottom: 20,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowRadius: 1,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: null,
    borderBottomWidth: 1,
    borderColor: '#fff',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  passwordContainer: {
    borderBottomWidth: 1,
    borderColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 40,
    backgroundColor: null,
    marginBottom: 10,
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
  },
  eyeIcon: {
    padding: 10,
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
  imageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
});

export default RegisterFreelancer;
