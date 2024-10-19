import React, { useState , useEffect} from 'react';
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { CustomTextInput } from '../utils/inputs'; // Importar los inputs reutilizables
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

  const handleCreateAccount = () => {
    navigation.navigate('ScreenTypeUser');
  };

  const handleSignIn = async () => {
    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden. Por favor, verifícalas.');
      return; // No continuar con el inicio de sesión
    }

    try {
      // Eliminar espacios en blanco al principio y al final del correo
      const trimmedEmail = email.trim();

      const userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      const user = userCredential.user;

      // Buscar en la colección de Freelancers
      const freelancersQuery = query(collection(db, 'Freelancers'), where('uid', '==', user.uid));
      const freelancersSnapshot = await getDocs(freelancersQuery);

      if (!freelancersSnapshot.empty) {
        const freelancerData = freelancersSnapshot.docs[0].data();
        if (freelancerData.verified === false) {
          navigation.navigate('VerificationStatus');
        } else {
          navigation.navigate('HomeScreenFreelancer', { freelancerId: freelancersSnapshot.docs[0].id });
        }
      } else {
        // Buscar en la colección de Clientes
        const clientsQuery = query(collection(db, 'Clients'), where('uid', '==', user.uid));
        const clientsSnapshot = await getDocs(clientsQuery);

        if (!clientsSnapshot.empty) {
          const clientData = clientsSnapshot.docs[0].data();
          if (clientData.verified === false) {
            navigation.navigate('VerificationStatus');
          } else {
            navigation.navigate('HomeScreenClient', { clientId: clientsSnapshot.docs[0].id });
          }
        } else {
          // Manejo de error si no se encuentra ni freelancer ni cliente
          console.log('No se encontró información del freelancer o cliente');
          Alert.alert('Error', 'No se encontró información del freelancer o cliente');
        }
      }

      // Limpiar los campos
      setEmail('');
      setPassword('');
    } catch (error) {

      // Mensaje específico para errores de autenticación
      if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
        Alert.alert('Error de inicio de sesión', 'El correo o la contraseña son incorrectos');
      } else if (error.code === 'auth/invalid-credential') {
        Alert.alert('Error de inicio de sesión', 'El correo o la contraseña son incorrectos');
      } else {
        Alert.alert('Error de inicio de sesión', error.message);
      }
    }
  };

  const limpiarCampos = () => {
    setEmail('');
    setPassword('');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={30} color="#15297C" />
        </TouchableOpacity>
        <Image source={require('../assets/Freelearnic.png')} style={styles.logo} />

        <View style={styles.containerView}>
          <View style={styles.login}>
            <Text style={styles.title}>
              Inicia sesion en tu cuenta de <Text style={{ fontWeight: 'bold' }}>Freelearnic</Text>
            </Text>

            <CustomTextInput 
              value={email} 
              onChangeText={setEmail} 
              placeholder="Correo Electrónico" 
            />
            <CustomTextInput   
              value={password} 
              onChangeText={setPassword} 
              placeholder="Contraseña" 
              secureTextEntry={true}
              showPassword={showPassword}
              toggleShowPassword={() => setShowPassword(!showPassword)}
            />
           <CustomTextInput onChangeText={setConfirmPassword} value={confirmPassword} placeholder="Confirmar contraseña" secureTextEntry={true} />
              <View style={styles.errorContainer}>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>

            <TouchableOpacity onPress={handleSignIn} style={styles.buttonLogin}>
              <Text style={styles.buttonTextLogin}>Iniciar Sesión</Text>
            </TouchableOpacity>
            <Text onPress={() => navigation.navigate('ScreenTypeUser')} style={styles.linkText}>
            <Text style={{ color: '#fff', marginStart:2}}>¿No tienes cuenta? </Text><Text style={{ fontWeight: 'bold', color: '#15297C' }}>Regístrate</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    position: 'relative',
  },
  errorContainer: {
    width: '100%',
    alignItems: 'flex-end',
  },
  errorText: {
    color: '#ffff',
    fontSize: 12,
    marginTop: 5,
    fontWeight: 'bold',
    top: -25,
    backgroundColor: null, // Ensure the text is visible
  },
  scrollViewContent: {
    zIndex: 0,
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
  },
  logo: {
    width: 120,
    height: 130,
    borderRadius: 4,
    marginBottom: 20,
    alignSelf: 'center',
  },
  containerView: {
    backgroundColor: '#107acc',
    width: '100%',
    height: '100%',
    padding: 30,
    borderTopLeftRadius: 130,
    overflow: 'hidden',
  },
  login: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'none',
    marginBottom: 70,
    marginTop: 15,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowRadius: 1,
  },
  buttonLogin: {
    width: '100%',
    height: 40,
    backgroundColor: '#15297C',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 25,
  },
  buttonRegister: {
    width: '100%',
    height: 40,
    marginBottom: 30,
    backgroundColor: '#E6F3FF',
    borderRadius: 50,
    borderColor: '#007AFF',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextLogin: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  buttonTextRegister: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#fff',
    marginBottom: 10,
    width: '100%',
    height: 40,
  },
  linkText: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});
