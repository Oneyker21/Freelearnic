import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import { doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { CustomTextInput, ImagePickerButton, PreviewImage } from '../../utils/inputs'; // Importar componentes personalizados
import Icon from 'react-native-vector-icons/FontAwesome';

const RegisterFreelancer = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [numCedula, setNumCedula] = useState('');
  const [profesion, setProfesion] = useState('');
  const [fotoCedulaFront, setFotoCedulaFront] = useState(null);
  const [fotoCedulaBack, setFotoCedulaBack] = useState(null);
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Estado de carga
  const [error, setError] = useState('');

  useEffect(() => {
    console.log(password, confirmPassword); // Depuración para ver los valores actuales
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
    setConfirmPassword('');
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
    setIsLoading(true); // Activar estado de carga
    try {
      if (password !== confirmPassword) {
        setIsLoading(false); // Desactivar estado de carga antes de mostrar el alerta
        Alert.alert('Error', 'Las contraseñas no coinciden');
        return;
      }

      // Crear el usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const idFreelancer = await obtenerSiguienteId();

      await setDoc(doc(db, 'Freelancer', idFreelancer), {
        uid: user.uid,
        id: idFreelancer,
        nombres,
        apellidos,
        nombre_usuario: nombreUsuario,
        email,
        tipo_usuario: 'freelancer',
        estado_verificacion: false,
        fecha_registro: new Date().toISOString(),
        num_cedula: numCedula,
        foto_cedula_front: fotoCedulaFront,
        foto_cedula_back: fotoCedulaBack,
        foto_perfil: fotoPerfil,
        estado_usuario: 'activo',
        profesion,
      });

      console.log('Freelancer registrado con éxito');
      Alert.alert('Éxito', 'Freelancer registrado correctamente', [
        {
          text: 'OK',
          onPress: () => {
            limpiarCampos();
            navigation.replace('Inicio de sesión');
          }
        }
      ]);
    } catch (error) {
      console.error('Error al registrar el freelancer: ', error);
      Alert.alert('Error', 'No se pudo registrar el freelancer: ' + error.message);
    } finally {
      setIsLoading(false); // Desactivar estado de carga
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <SkeletonPlaceholder>
          <SkeletonPlaceholder.Item flexDirection="column" alignItems="center">
            <SkeletonPlaceholder.Item width={300} height={40} borderRadius={4} marginBottom={20} />
            <SkeletonPlaceholder.Item width={300} height={40} borderRadius={4} marginBottom={10} />
            <SkeletonPlaceholder.Item width={300} height={40} borderRadius={4} marginBottom={10} />
            <SkeletonPlaceholder.Item width={300} height={40} borderRadius={4} marginBottom={10} />
          </SkeletonPlaceholder.Item>
        </SkeletonPlaceholder>
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
              <CustomTextInput onChangeText={setNombreUsuario} value={nombreUsuario} placeholder="Nombre de usuario" />
              <CustomTextInput onChangeText={setEmail} value={email} placeholder="Correo Electrónico" />
              <CustomTextInput onChangeText={setPassword} value={password} placeholder="Contraseña" secureTextEntry={true} showPassword={showPassword} toggleShowPassword={() => setShowPassword(!showPassword)} />
              <CustomTextInput onChangeText={setConfirmPassword} value={confirmPassword} placeholder="Confirmar Contraseña" secureTextEntry={true} />
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              <CustomTextInput onChangeText={setNumCedula} value={numCedula} placeholder="Número de Cédula" />
              <CustomTextInput onChangeText={setProfesion} value={profesion} placeholder="Profesión" />

              <ImagePickerButton onPress={() => pickImage(setFotoCedulaFront, false)} iconName="id-card-o" buttonText="Cédula (Frente)" />
              <PreviewImage uri={fotoCedulaFront} />
              <ImagePickerButton onPress={() => pickImage(setFotoCedulaBack, false)} iconName="id-card-o" buttonText="Cédula (Reverso)" />
              <PreviewImage uri={fotoCedulaBack} />
              <ImagePickerButton onPress={() => pickImage(setFotoPerfil, false)} iconName="user-circle-o" buttonText="Foto de Perfil" />
              <PreviewImage uri={fotoPerfil} />

              <TouchableOpacity onPress={registrarFreelancer} style={styles.buttonRegister}>
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
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
    backgroundColor: 'white', // Asegurarse de que el texto sea visible
  },
});

export default RegisterFreelancer;
