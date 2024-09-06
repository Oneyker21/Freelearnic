import React from 'react';
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Button, Alert } from 'react-native';
import { BlurView } from 'expo-blur'
import { useNavigation } from '@react-navigation/native'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, initializeAuth, getReactNativePersistence } from 'firebase/auth'; // Importación única
import { Picker } from '@react-native-picker/picker'; // Asegúrate de importar el Picker
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebaseConfig";



const url = 'https://ak.picdn.net/shutterstock/videos/1060308725/thumb/1.jpg'

const RegisterUsers = () => {






  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [profesion, setProfesion] = React.useState('') // Nueva variable de estado
  const [categoria, setCategoria] = React.useState(''); // Cambiar idCategoria a categoria
  const [descripcion, setDescripcion] = React.useState('') // Nueva variable de estado

  const auth = getAuth();
  const navigation = useNavigation();


  
  const addCity = async () => {
    try {
      await setDoc(doc(db, "cities", "LA"), {
        name: "Los Angeles",
        state: "CA",
        country: "USA"
      });
      console.log('Ciudad añadida con éxito');
    } catch (error) {
      console.error('Error al añadir la ciudad: ', error);
    }
  };

  const handleCreateAccount = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        console.log('Cuenta creada!');
        const user = userCredential.user;
        console.log(user);
        Alert.alert('Cuenta creada!, Inicia Sesión');
        await addCity(); // Llama a la función para añadir la ciudad
        // Limpiar los campos
        setEmail('');
        setPassword('');
        setProfesion(''); // Limpiar profesion
        setCategoria(''); // Limpiar categoria
        setDescripcion(''); // Limpiar descripcion
        navigation.navigate('Inicio de sesión');
      })
      .catch(error => {
        console.log(error);
        Alert.alert(error.message);
      });
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


            <Text style={styles.title}>Registrarse</Text>


            <TextInput style={styles.input} onChangeText={(text) => setEmail(text)} placeholder="Correo Electronico" />
            <TextInput style={styles.input} onChangeText={(text) => setPassword(text)} placeholder="Contraseña" secureTextEntry />
            <TextInput style={styles.input} onChangeText={(text) => setProfesion(text)} placeholder="Profesión" />
            <Picker
              selectedValue={categoria}
              onValueChange={(itemValue) => setCategoria(itemValue)}
              style={styles.input} // Estilo similar al input
            >
              <Picker.Item label="Selecciona una categoría" value="" />
              <Picker.Item label="Principiante" value="principiante" />
              <Picker.Item label="Intermedio" value="intermedio" />
              <Picker.Item label="Profesional" value="profesional" />
            </Picker>
            <TextInput style={styles.input} onChangeText={(text) => setDescripcion(text)} placeholder="Descripción" />
            <TouchableOpacity onPress={addCity } style={styles.buttonRegister}>
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
});

export default RegisterUsers;
