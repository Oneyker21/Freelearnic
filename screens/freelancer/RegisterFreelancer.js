import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc, getDocs, query, where, collection } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { CustomTextInput, ImagePickerButton, PreviewImage } from '../../utils/inputs';
import SelectModal from '../freelancer/SelectDeparMuni'; // Asegúrate de importar el componente modal

const RegisterFreelancer = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [numCedula, setNumCedula] = useState(''); // Estado para el número de cédula
  const [fotoCedulaFront, setFotoCedulaFront] = useState(null);
  const [fotoCedulaBack, setFotoCedulaBack] = useState(null);
  const [municipio, setMunicipio] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [mensajeErrorCedula, setMensajeErrorCedula] = useState('');
  const [modalDepartamentoVisible, setModalDepartamentoVisible] = useState(false);
  const [modalMunicipioVisible, setModalMunicipioVisible] = useState(false);

  // Datos de ejemplo para departamentos y municipios
  const departamentos = [
    { id: 1, name: 'Managua' },
    { id: 2, name: 'León' },
    { id: 3, name: 'Chinandega' },
    // Agrega más departamentos según sea necesario
  ];

  const municipios = [
    { id: 1, name: 'Municipio 1' },
    { id: 2, name: 'Municipio 2' },
    { id: 3, name: 'Municipio 3' },
    // Agrega más municipios según sea necesario
  ];


  const handleSelectDepartamento = (item) => {
    setDepartamento(item.name);
    setModalDepartamentoVisible(false);
  };

  const handleSelectMunicipio = (item) => {
    setMunicipio(item.name);
    setModalMunicipioVisible(false);
  };

  useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
    } else {
      setError('');
    }
  }, [password, confirmPassword]);

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


  // Función para verificar si la cédula ya existe en Firestore
  const verificarCedulaExistente = async (cedula) => {
    const q = query(collection(db, "Freelancer"), where("num_cedula", "==", cedula));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // Retorna true si la cédula ya existe, false si no
  };

  // Función para manejar el cambio en el campo de cédula
  const handleNumCedulaChange = (text) => {
    // Limitar la longitud a 14 caracteres
    if (text.length > 14) {
      return; // No hacer nada si se excede la longitud
    }

    // Convertir el texto a mayúsculas
    const upperCaseText = text.toUpperCase();

    // Actualizar el estado con el texto ingresado
    setNumCedula(upperCaseText);

    // Validar que solo contenga números y letras
    const regexCedula = /^[0-9A-Z]{14}$/; // 14 caracteres que pueden ser números o letras en mayúsculas
    if (!regexCedula.test(upperCaseText)) {
      setMensajeErrorCedula('Digite la cédula sin guiones, ejemplo 1211111111111K.');
    } else {
      setMensajeErrorCedula(''); // Limpiar el mensaje de error si es válido  
    }
  };


  const registrarFreelancer = async () => {
    setIsLoading(true);

    // Validaciones previas (campos vacíos, formato de correo, etc.)
    if (!email || !password || !confirmPassword || !nombres || !apellidos || !numCedula || !fotoCedulaFront || !fotoCedulaBack || !municipio || !departamento) {
      Alert.alert('Error', 'Por favor, completa todos los campos requeridos.');
      setIsLoading(false);
      return;
    }

    // Eliminar espacios en blanco al principio y al final del correo
    const trimmedEmail = email.trim();

    // Validar que el correo electrónico sea de Gmail
    const regexEmail = /^[a-zA-Z0-9._%+-]+@gmail\.com$/; // Solo acepta correos de Gmail
    if (!regexEmail.test(trimmedEmail)) {
      Alert.alert('Error', 'Por favor, introduce un correo electrónico válido de Gmail.');
      setIsLoading(false);
      return;
    }

    // Validar el número de cédula antes de continuar
    const regexCedula = /^[0-9A-Za-z]{14}$/; // 14 caracteres que pueden ser números o letras
    if (!regexCedula.test(numCedula)) {
      Alert.alert('Error', 'La cédula debe contener solo 14 caracteres, que pueden ser números y letras.');
      setIsLoading(false);
      return;
    }

    // Verificar si la cédula ya existe en Firestore
    const cedulaExistente = await verificarCedulaExistente(numCedula);
    if (cedulaExistente) {
      Alert.alert('Error', 'La cédula ya está registrada. Por favor, utiliza otra.');
      setIsLoading(false);
      return;
    }

    // Continuar con el registro si todas las validaciones son correctas
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
      const user = userCredential.user;
      const idFreelancer = `id_freelancer_${user.uid}`;

      await setDoc(doc(db, 'Freelancer', idFreelancer), {
        uid: user.uid,
        id: idFreelancer,
        nombres,
        apellidos,
        email: trimmedEmail, // Guardar el correo sin espacios
        num_cedula: numCedula, // Guardar cédula tal como se ingresa
        foto_cedula_front: fotoCedulaFront,
        foto_cedula_back: fotoCedulaBack,
        municipio,
        departamento,
        tipo_usuario: 'freelancer',
        estado_verificacion: false,
        fecha_registro: new Date().toISOString(),
        foto_perfil: null,
        estado_usuario: 'activo',
        nivel: null,
        profesion: null,
        descripcion: null,
        calificacion_promedio: null,
        num_trabajos_completados: null,
        estado_disponibilidad: null,
        portafolio: [],
        certificaciones: [],
        idiomas_hablados: [],
        experiencia_profesional: null,
        habilidades: [],
        preferencias_trabajo: {
          tipo_proyectos: null,
          horarios: null,
          modalidad: null
        },
        enlaces_redes_sociales: {
          LinkedIn: null,
          Behance: null,
          Dribbble: null
        },
        suscripciones: []
      });

      Alert.alert('Éxito', 'Freelancer registrado correctamente', [
        { text: 'OK', onPress: () => navigation.replace('Inicio de sesión') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'No se pudo registrar el freelancer: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text>Cargando...</Text>
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
                Crear una cuenta de <Text style={{ fontWeight: 'bold' }}>Freelearnic</Text>
              </Text>
              <CustomTextInput onChangeText={setNombres} value={nombres} placeholder="Nombres" />
              <CustomTextInput onChangeText={setApellidos} value={apellidos} placeholder="Apellidos" />
              <CustomTextInput onChangeText={setEmail} value={email} placeholder="Correo Electrónico" />
              <CustomTextInput onChangeText={setPassword} value={password} placeholder="Contraseña" secureTextEntry={true} />
              <CustomTextInput onChangeText={setConfirmPassword} value={confirmPassword} placeholder="Confirmar Contraseña" secureTextEntry={true} />
              <View style={styles.errorContainer}>
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
              </View>
              <CustomTextInput 
                onChangeText={handleNumCedulaChange} // Cambiar a la nueva función
                value={numCedula} 
                placeholder="Número de Cédula" 
              />
              {mensajeErrorCedula ? <Text style={styles.textError}>{mensajeErrorCedula}</Text> : null}
              <ImagePickerButton onPress={() => pickImage(setFotoCedulaFront, false)} iconName="id-card-o" buttonText="Cédula (Frente)" />
              <PreviewImage uri={fotoCedulaFront} />
              <ImagePickerButton onPress={() => pickImage(setFotoCedulaBack, false)} iconName="id-card-o" buttonText="Cédula (Reverso)" />
              <PreviewImage uri={fotoCedulaBack} />
              <TouchableOpacity onPress={() => setModalDepartamentoVisible(true)}>
                <Text style={styles.selectorText}>{departamento || 'Seleccionar Departamento'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setModalMunicipioVisible(true)}>
                <Text style={styles.selectorText}>{municipio || 'Seleccionar Municipio'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={registrarFreelancer} style={styles.buttonRegister}>
                <Text style={styles.buttonTextRegister}>Registrar</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* Modal para seleccionar departamento */}
          <SelectModal
            visible={modalDepartamentoVisible}
            onClose={() => setModalDepartamentoVisible(false)}
            data={departamentos}
            onSelect={handleSelectDepartamento}
          />
          {/* Modal para seleccionar municipio */}
          <SelectModal
            visible={modalMunicipioVisible}
            onClose={() => setModalMunicipioVisible(false)}
            data={municipios}
            onSelect={handleSelectMunicipio}
          />
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
    backgroundColor: null, // Asegurarse de que el texto sea visible
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  textError: {
    color: 'red',
  },
  textSuccess: {
    color: 'green',
  },
  selectorText: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    textAlign: 'center',
  },
});


export default RegisterFreelancer;