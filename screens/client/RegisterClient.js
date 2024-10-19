import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc, getDocs, query, where, collection } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { CustomTextInput } from '../../utils/inputs';

const RegisterClient = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [idNumber, setIdNumber] = useState(''); // State for ID number
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [idErrorMessage, setIdErrorMessage] = useState('');

  const auth = getAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
    } else {
      setError('');
    }
  }, [password, confirmPassword]);

  // Function to check if the ID number already exists in Firestore
  const checkIdNumberExists = async (idNumber) => {
    const q = query(collection(db, "Clients"), where("idNum", "==", idNumber));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // Returns true if the ID number already exists, false if not
  };

  // Function to check if the username already exists in Firestore
  const checkUsernameExists = async (username) => {
    const q = query(collection(db, "Clients"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // Returns true if the username already exists, false if not
  };

  // Function to handle changes in the ID number field
  const handleIdNumberChange = (text) => {
    // Limit the length to 14 characters
    if (text.length > 14) {
      return; // Do nothing if the length is exceeded
    }

    // Convert the text to uppercase
    const upperCaseText = text.toUpperCase();

    // Update the state with the entered text
    setIdNumber(upperCaseText);

    // Validate that it only contains numbers and letters
    const regexIdNumber = /^[0-9A-Z]{14}$/; // 14 characters that can be numbers or uppercase letters
    if (!regexIdNumber.test(upperCaseText)) {
      setIdErrorMessage('El número de cédula es incorrecto, Ejemplo: 1211111111111K.');
    } else {
      setIdErrorMessage(''); // Clear the error message if it's valid  
    }
  };

  // Manejar el cambio en el campo de correo electrónico
  const handleEmailChange = (text) => {
    // Convertir el texto a minúsculas
    const lowerCaseText = text.toLowerCase();
    setEmail(lowerCaseText);
  };

  const handleNext = async () => {
    // Validar que todos los campos requeridos estén llenos
    if (!email || !password || !confirmPassword || !firstName || !lastName || !username || !idNumber) {
      Alert.alert('Error', 'Por favor, rellene todos los campos.');
      return;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);

    // Validación de la contraseña
    const regexPassword = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/; // Al menos 8 caracteres, una mayúscula, un número y un carácter especial
    if (!regexPassword.test(password)) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.');
      setIsLoading(false);
      return;
    }

    // Remove leading and trailing spaces from the email
    const trimmedEmail = email.trim();

    // Check if the username already exists in Firestore
    const existingUsername = await checkUsernameExists(username);
    if (existingUsername) {
      Alert.alert('Error', 'El nombre de usuario ya existe.');
      setIsLoading(false);
      return;
    }

    // Validar que el correo electrónico sea de Gmail y solo acepte minúsculas
    const regexEmail = /^[a-z0-9._%+-]+@gmail\.com$/; // Solo acepta correos electrónicos de Gmail en minúsculas
    if (!regexEmail.test(trimmedEmail)) {
      Alert.alert('Error', 'Por favor digite un correo electrónico correcto.');
      setIsLoading(false);
      return;
    }

    // Validate the ID number before continuing
    const regexIdNumber = /^[0-9A-Za-z]{14}$/; // 14 characters that can be numbers or letters
    if (!regexIdNumber.test(idNumber)) {
      Alert.alert('Error', 'Debe de contener 14 caracteres sin guiones.');
      setIsLoading(false);
      return;
    }

    // Check if the ID number already exists in Firestore
    const existingIdNumber = await checkIdNumberExists(idNumber);
    if (existingIdNumber) {
      Alert.alert('Error', 'El número de cédula ya existe.');
      setIsLoading(false);
      return;
    }

    // Navegar al siguiente componente y pasar los datos
    navigation.navigate('RegisterClient2', {
      email,
      password,
      firstName,
      lastName,
      username,
      idNumber,
    });
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={30} color="#15297C" />
          </TouchableOpacity>
          <Image source={require('../../assets/Freelearnic.png')} style={styles.logo} />
          <View style={styles.containerView}>
            <View style={styles.login}>
              <Text style={styles.title}>
               <Text>Continuación</Text> 
              </Text>
              <CustomTextInput onChangeText={setFirstName} value={firstName} placeholder="Nombres" />
              <CustomTextInput onChangeText={setLastName} value={lastName} placeholder="Apellidos" />
              <CustomTextInput onChangeText={setUsername} value={username} placeholder="Nombre Usuario" />
              <CustomTextInput onChangeText={handleEmailChange} value={email} placeholder="Correo Electrónico" />
              <CustomTextInput onChangeText={setPassword} value={password} placeholder="Contraseña" secureTextEntry={true} />
              <CustomTextInput onChangeText={setConfirmPassword} value={confirmPassword} placeholder="Confirmar contraseña" secureTextEntry={true} />
              <View style={styles.errorContainer}>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>
              <CustomTextInput 
                onChangeText={handleIdNumberChange} 
                value={idNumber} 
                placeholder="Número cédula" 
              />
              {idErrorMessage ? <Text style={styles.textError}>{idErrorMessage}</Text> : null}
              <TouchableOpacity onPress={handleNext} style={styles.buttonRegister}>
                <Text style={styles.buttonTextRegister}>Siguiente</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
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
  buttonRegister: {
    width: '100%',
    height: 50,
    marginTop: 30,
    backgroundColor: '#15297C',
    borderRadius: 50,
    marginBottom: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerView: {
    backgroundColor: '#107acc',
    width: '100%',
    padding: 20,
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

  buttonTextRegister: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
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
    fontSize: 12,
    marginTop: 5,
    textAlign: 'justify',
    fontWeight: 'bold',
    top:-25,
    backgroundColor: null, // Ensure the text is visible
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  textError: {
    color: '#8b0000',
    textAlign: 'left'
  },
});

export default RegisterClient;
