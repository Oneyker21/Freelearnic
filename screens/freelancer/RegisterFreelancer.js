import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { getAuth, fetchSignInMethodsForEmail } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import {getDocs, query, where, collection } from 'firebase/firestore';
import { db } from '../../connection/firebaseConfig';
import { Ionicons } from '@expo/vector-icons';
import { CustomTextInput } from '../../utils/inputs';

const RegisterFreelancer = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword2, setConfirmPassword2] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [idNumber, setIdNumber] = useState(''); // State for ID number
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [idErrorMessage, setIdErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const auth = getAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (password && confirmPassword2 && password !== confirmPassword2) {
      setError('Las contraseñas no coinciden');
    } else {
      setError('');
    }
  }, [password, confirmPassword2]);  // Asegúrate de que estás usando confirmPassword2 aquí

  // Function to check if the ID number already exists in Firestore
  const checkIdNumberExists = async (idNumber) => {
    const q = query(collection(db, "Freelancers"), where("idNum", "==", idNumber));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // Returns true if the ID number already exists, false if not
  };

  // Function to check if the username already exists in Firestore
  const checkUsernameExists = async (username) => {
    const q = query(collection(db, "Freelancers"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // Returns true if the username already exists, false if not
  };



  // Function to handle changes in the ID number field
  const handleIdNumberChange = (text) => {
    // Limit the length to 14 characters
    if (text.length > 14) {
      return; // Do nothing if the length is exceeded
    }

    // Update the state with the entered text
    setIdNumber(text);

    // Validate that it contains 13 digits followed by a letter
    const regexIdNumber = /^[0-9]{13}[A-Za-z]$/; // 13 digits followed by a letter
    if (!regexIdNumber.test(text)) {
      setIdErrorMessage('El número de cédula es incorrecto, Ejemplo: 1234567890123K.');
    } else {
      setIdErrorMessage(''); // Clear the error message if it's valid  
    }
  };
  // Manejar el cambio en el campo de correo electrónico
  const handleEmailChange = (text) => {
    // Eliminar espacios del texto ingresado
    const textWithoutSpaces = text.replace(/\s+/g, '');

    // Actualizar el estado con el texto sin espacios
    setEmail(textWithoutSpaces);
  };
  const handleNext = async () => {
    const emailToLower = email.toLowerCase();

    // Convertir el número de identificación a mayúsculas antes de la validación y enviarlo
    const idNumberToUpper = idNumber.toUpperCase();

    // Validar que todos los campos requeridos estén llenos
    if (!emailToLower || !password || !confirmPassword2 || !firstName || !lastName || !username || !idNumberToUpper) {
      Alert.alert('Error', 'Por favor, rellene todos los campos.');
      return;
    }

    if (password !== confirmPassword2) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);

  // Validación de la contraseña
  const regexPassword = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  if (!regexPassword.test(password)) {
    Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.');
    setIsLoading(false);
    return;
  }

  // Validar que el correo electrónico sea de Gmail y solo acepte minúsculas
  const regexEmail = /^[a-z0-9._%+-]+@gmail\.com$/;
  if (!regexEmail.test(emailToLower)) {
    Alert.alert('Error', 'Por favor digite un correo electrónico correcto.');
    setIsLoading(false);
    return;
  }

  // Validar el número de identificación antes de continuar
  const regexIdNumber = /^[0-9]{13}[A-Za-z]$/;
  if (!regexIdNumber.test(idNumberToUpper)) {
    Alert.alert('Error', 'El número de cédula debe contener 13 dígitos seguidos de una letra.');
    setIsLoading(false);
    return;
  }

  // Verificar si el nombre de usuario ya existe en Firestore
  const existingUsername = await checkUsernameExists(username);
  if (existingUsername) {
    Alert.alert('Error', 'El nombre de usuario ya existe.');
    setIsLoading(false);
    return;
  }

  // Verificar si el número de identificación ya existe en Firestore
  const existingIdNumber = await checkIdNumberExists(idNumberToUpper);
  if (existingIdNumber) {
    Alert.alert('Error', 'El número de cédula ya existe.');
    setIsLoading(false);
    return;
  }

    // Navegar al siguiente componente y pasar los datos convertidos
    navigation.navigate('RegisterFreelancer2', {
        email: emailToLower,
        password,
        firstName,
        lastName,
        username,
        idNumber: idNumberToUpper, // Asegúrate de que se envía en mayúsculas
    });
  };

  return (
    <View style={styles.container}>
    {isLoading ? (
      <View style={styles.loadingContainer}>
        <Image 
          source={require('../../assets/img/loading.png')} // Asegúrate de que la ruta sea correcta
          style={styles.loadingImage}
          resizeMode="contain" // Ajusta la imagen para que se contenga dentro del área
        />
      </View>
    ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={30} color="#15297C" />
          </TouchableOpacity>
          <Image source={require('../../assets/img/Freelearnic.png')} style={styles.logo} />
          <View style={styles.containerView}>
            <View style={styles.login}>
            <Text style={styles.title}>
              Crea una <Text>cuenta de</Text> <Text style={{ fontWeight: 'bold' }}>Freelearnic</Text>
            </Text>
              <CustomTextInput onChangeText={setFirstName} value={firstName} placeholder="Nombres" />
              <CustomTextInput onChangeText={setLastName} value={lastName} placeholder="Apellidos" />
              <CustomTextInput onChangeText={setUsername} value={username} placeholder="Nombre Usuario" />
              <CustomTextInput
                onChangeText={handleEmailChange}
                value={email}
                placeholder="Correo Electrónico"
                autoCapitalize="none"  // Asegura que el teclado no auto-capitalize las entradas
              />
              
              <CustomTextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Contraseña"
                secureTextEntry={true}
                showPassword={showPassword}
                toggleShowPassword={() => setShowPassword(!showPassword)}
              />
                <CustomTextInput
                  onChangeText={setConfirmPassword2} showPassword={showPassword2}
                  toggleShowPassword={() => setShowPassword2(!showPassword2)}
                  value={confirmPassword2}
                  placeholder="Confirmar contraseña"
                  secureTextEntry={true} />
              <View style={styles.errorContainer}>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>
              <CustomTextInput 
                onChangeText={handleIdNumberChange} 
                value={idNumber} 
                placeholder="Número de cédula" 
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
    fontSize: 14,
    marginTop: 5,
    fontWeight: 'bold',
    backgroundColor: null, // Ensure the text is visible
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor:'#107acc' 
  },
  loadingImage: {
    width: 160, // Ajusta el tamaño según sea necesario
    height: 160, // Ajusta el tamaño según sea necesario
    marginBottom: 10, // Espacio entre la imagen y el texto
  },
  textError: {
    color: '#ffff',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'justify',
    fontWeight: 'bold',
    top:-25,
    backgroundColor: null, // Ensure the text is visible
  },
});

export default RegisterFreelancer;
