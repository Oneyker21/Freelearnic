import React from 'react'
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Button, Alert } from 'react-native'
import { BlurView } from 'expo-blur'
import { useNavigation } from '@react-navigation/native'
import { initializeApp } from 'firebase/app'; // Asegúrate de importar esto primero
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, initializeAuth, getReactNativePersistence } from 'firebase/auth'; // Importación única
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig } from '../config/firebaseConfig';

// Inicializa Firebase
const app = initializeApp(firebaseConfig); // Mueve esta línea aquí
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});



//URL del fondo del login
const url = 'https://ak.picdn.net/shutterstock/videos/1060308725/thumb/1.jpg'




//imagen del logo 
//const logoUrl = 'https://ejemplo.com/ruta-a-tu-logo.png'

export default function LoginScreen() {

  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const auth = getAuth();
  const navigation = useNavigation();

  const handleCreateAccount = () => {
    // Redirige a la pantalla de registro
    navigation.navigate('Register'); // Cambia 'RegisterScreen' por el nombre de tu pantalla de registro
  }
  
  const handleSignIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Sesión iniciada!')
        const user = userCredential.user;
        console.log(user)
        navigation.navigate('Home');
      })
      .catch(error => {
        console.log(error)
        Alert.alert(error.message)
      })
  }



  return (
    <View style={styles.container}>
      <Image source={{ uri: url }} style={[styles.image, StyleSheet.absoluteFill]} />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <BlurView intensity={90} tint="light" style={styles.blurContainer}>
          <View style={styles.login}>


            <Image
              source={require('../assets/icon/favicon.png')}
              style={styles.logo}
            />

            {/*   
                <Image source={{uri: logoUrl}} style={styles.logo} /> 
                imagen de logo externa
                   
                   */}
                   

            <Text style={styles.title}>Bienvenido</Text>


            <TextInput style={styles.input} onChangeText={(text) => setEmail(text)} placeholder="Usuario" />
            <TextInput style={styles.input} onChangeText={(text) => setPassword(text)} placeholder="Contraseña" secureTextEntry />


            <TouchableOpacity onPress={handleSignIn} style={styles.buttonLogin}>
              <Text style={styles.buttonText}>Iniciar Sesión</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCreateAccount} style={styles.buttonRegister}>
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
})