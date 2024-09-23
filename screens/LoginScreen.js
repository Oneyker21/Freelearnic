import React, { useState } from 'react';
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome';

// URL del fondo del login
const url = 'https://ak.picdn.net/shutterstock/videos/1060308725/thumb/1.jpg';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const auth = getAuth();
  const navigation = useNavigation();

  const handleCreateAccount = () => {
    navigation.navigate('Registrar Cuenta');
  };

  const handleSignIn = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Buscar en la colección de Freelancers
      const freelancersQuery = query(collection(db, 'Freelancer'), where('uid', '==', user.uid));
      const freelancersSnapshot = await getDocs(freelancersQuery);

      if (!freelancersSnapshot.empty) {
        const freelancerData = freelancersSnapshot.docs[0].data(); // Asegúrate de obtener los datos del documento
        if (freelancerData.estado_verificacion === false) { // Cambiado para verificar si es falso
          navigation.navigate('VerificationStatus');
        } else {
          navigation.navigate('HomeScreenFreelancer', { freelancerId: freelancersSnapshot.docs[0].id });
        }
      } else {
        // Manejo de error si no se encuentra el freelancer
        console.log('No se encontró información del freelancer');
        Alert.alert('Error', 'No se encontró información del freelancer');
      }

      // Limpiar los campos
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      Alert.alert('Error de inicio de sesión', error.message);
    }
  };

  const limpiarCampos = () => {
    setEmail('');
    setPassword('');
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: url }} style={[styles.image, StyleSheet.absoluteFill]} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <BlurView intensity={100} tint="light" style={styles.blurContainer}>
          <View style={styles.login}>
            <Image
              source={require('../assets/icon/favicon.png')}
              style={styles.logo}
            />

            <Text style={styles.title}>Iniciar Sesión</Text>

            <TextInput 
              style={styles.input} 
              onChangeText={(text) => setEmail(text)} 
              value={email}
              placeholder="Correo Electrónico" 
            />
            <View style={styles.passwordContainer}>
              <TextInput 
                style={styles.passwordInput} 
                onChangeText={(text) => setPassword(text)} 
                value={password}
                placeholder="Contraseña" 
                secureTextEntry={!showPassword} 
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Icon name={showPassword ? "eye" : "eye-slash"} size={20} color="#007AFF" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={handleSignIn} style={styles.buttonLogin}>
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { handleCreateAccount(); limpiarCampos(); }} style={styles.buttonRegister}>
              <Text style={styles.buttonTextRegister}>Registrarse</Text>
            </TouchableOpacity>

          </View>
        </BlurView>
      </ScrollView>
    </View>
  )
}

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
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
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
    textShadowRadius: 1
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  buttonLogin: {
    width: '100%',
    height: 40,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
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
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonTextRegister: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 5,
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
})