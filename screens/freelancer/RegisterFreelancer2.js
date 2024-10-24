import React, { useState, useEffect } from 'react';
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import {useRoute, useNavigation } from '@react-navigation/native';
import { doc, setDoc, getDocs, query, where, collection } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { CustomTextInput, ImagePickerButton, PreviewImage } from '../../utils/inputs';
import SelectModal from '../SelectDeparMuni'; // Make sure to import the modal component
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const RegisterFreelancer2 = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { email, password, firstName, lastName, username, idNumber } = route.params;
  const [idFrontPhoto, setIdFrontPhoto] = useState(null);
  const [idBackPhoto, setIdBackPhoto] = useState(null);
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [idErrorMessage, setIdErrorMessage] = useState('');
  const [modalStateVisible, setModalStateVisible] = useState(false);
  const [modalCityVisible, setModalCityVisible] = useState(false);
  const [filteredCities, setFilteredCities] = useState([]); // State for filtered cities
  const states = [
    { id: 1, name: 'Managua' },
    { id: 2, name: 'León' },
    { id: 3, name: 'Chinandega' },
    { id: 4, name: 'Masaya' },
    { id: 5, name: 'Granada' },
    { id: 6, name: 'Carazo' },
    { id: 7, name: 'Matagalpa' },
    { id: 8, name: 'Estelí' },
    { id: 9, name: 'Rivas' },
    { id: 10, name: 'Jinotega' },
    { id: 11, name: 'Madriz' },
    { id: 12, name: 'Boaco' },
    { id: 13, name: 'Chontales' },
    { id: 14, name: 'Río San Juan' },
    { id: 15, name: 'Nueva Segovia' },
    { id: 16, name: 'RACCN' }, // Región Autónoma de la Costa Caribe Norte
    { id: 17, name: 'RACCS' }  // Región Autónoma de la Costa Caribe Sur
  ];

  const cities = [
    // Cities of Managua
    { id: 1, name: 'Managua', stateId: 1 },
    { id: 2, name: 'San Francisco Libre', stateId: 1 },
    { id: 3, name: 'Tipitapa', stateId: 1 },
    { id: 4, name: 'Mateare', stateId: 1 },
    { id: 5, name: 'Villa Carlos Fonseca', stateId: 1 },
    { id: 6, name: 'Ciudad Sandino', stateId: 1 },
    { id: 7, name: 'Ticuantepe', stateId: 1 },
    { id: 8, name: 'El Crucero', stateId: 1 },
    { id: 9, name: 'San Rafael del Sur', stateId: 1 },
  
    // Cities of León
    { id: 10, name: 'León', stateId: 2 },
    { id: 11, name: 'Achuapa', stateId: 2 },
    { id: 12, name: 'El Sauce', stateId: 2 },
    { id: 13, name: 'Santa Rosa del Peñón', stateId: 2 },
    { id: 14, name: 'El Jicaral', stateId: 2 },
    { id: 15, name: 'Larreynaga', stateId: 2 },
    { id: 16, name: 'Telica', stateId: 2 },
    { id: 17, name: 'Quezalguaque', stateId: 2 },
    { id: 18, name: 'La Paz Centro', stateId: 2 },
    { id: 19, name: 'Nagarote', stateId: 2 },
  
    // Cities of Chinandega
    { id: 20, name: 'Chinandega', stateId: 3 },
    { id: 21, name: 'San Pedro del Norte', stateId: 3 },
    { id: 22, name: 'San Francisco del Norte', stateId: 3 },
    { id: 23, name: 'Cinco Pinos', stateId: 3 },
    { id: 24, name: 'Santo Tomás del Norte', stateId: 3 },
    { id: 25, name: 'Somotillo', stateId: 3 },
    { id: 26, name: 'Villanueva', stateId: 3 },
    { id: 27, name: 'El Viejo', stateId: 3 },
    { id: 28, name: 'Puerto Morazán', stateId: 3 },
    { id: 29, name: 'Chichigalpa', stateId: 3 },
    { id: 30, name: 'Posoltega', stateId: 3 },
    { id: 31, name: 'El Realejo', stateId: 3 },
    { id: 32, name: 'Corinto', stateId: 3 },
  
    // Cities of Masaya
    { id: 33, name: 'Masaya', stateId: 4 },
    { id: 34, name: 'Catarina', stateId: 4 },
    { id: 35, name: 'Masatepe', stateId: 4 },
    { id: 36, name: 'Nandasmo', stateId: 4 },
    { id: 37, name: 'Nindirí', stateId: 4 },
    { id: 38, name: 'Niquinohomo', stateId: 4 },
    { id: 39, name: 'San Juan de Oriente', stateId: 4 },
    { id: 40, name: 'Tisma', stateId: 4 },
  
    // Cities of Granada
    { id: 41, name: 'Granada', stateId: 5 },
    { id: 42, name: 'Diriomo', stateId: 5 },
    { id: 43, name: 'Diriá', stateId: 5 },
    { id: 44, name: 'Nandaime', stateId: 5 },
  
    // Cities of Carazo
    { id: 45, name: 'Jinotepe', stateId: 6 },
    { id: 46, name: 'San Marcos', stateId: 6 },
    { id: 47, name: 'Diriamba', stateId: 6 },
    { id: 48, name: 'Dolores', stateId: 6 },
    { id: 49, name: 'El Rosario', stateId: 6 },
    { id: 50, name: 'La Paz de Carazo', stateId: 6 },
    { id: 51, name: 'Santa Teresa', stateId: 6 },
    { id: 52, name: 'La Conquista', stateId: 6 },
  
    // Cities of Matagalpa
    { id: 53, name: 'Matagalpa', stateId: 7 },
    { id: 54, name: 'Rancho Grande', stateId: 7 },
    { id: 55, name: 'Río Blanco', stateId: 7 },
    { id: 56, name: 'El Tuma-La Dalia', stateId: 7 },
    { id: 57, name: 'San Isidro', stateId: 7 },
    { id: 58, name: 'Sébaco', stateId: 7 },
    { id: 59, name: 'San Ramón', stateId: 7 },
    { id: 60, name: 'Matiguás', stateId: 7 },
    { id: 61, name: 'Muy Muy', stateId: 7 },
    { id: 62, name: 'Esquipulas', stateId: 7 },
    { id: 63, name: 'San Dionisio', stateId: 7 },
    { id: 64, name: 'Terrabona', stateId: 7 },
    { id: 65, name: 'Ciudad Darío', stateId: 7 },
  
    // Cities of Estelí
    { id: 66, name: 'Estelí', stateId: 8 },
    { id: 67, name: 'Pueblo Nuevo', stateId: 8 },
    { id: 68, name: 'Condega', stateId: 8 },
    { id: 69, name: 'San Juan de Limay', stateId: 8 },
    { id: 70, name: 'La Trinidad', stateId: 8 },
    { id: 71, name: 'San Nicolás', stateId: 8 },
  
    // Cities of Rivas
    { id: 72, name: 'Rivas', stateId: 9 },
    { id: 73, name: 'Altagracia', stateId: 9 },
    { id: 74, name: 'Belén', stateId: 9 },
    { id: 75, name: 'Buenos Aires', stateId: 9 },
    { id: 76, name: 'Cárdenas', stateId: 9 },
    { id: 77, name: 'Moyogalpa', stateId: 9 },
    { id: 78, name: 'Potosí', stateId: 9 },
    { id: 79, name: 'San Jorge', stateId: 9 },
     // Cities of Jinotega
  { id: 80, name: 'Jinotega', stateId: 10 },
  { id: 81, name: 'San Rafael del Norte', stateId: 10 },
  { id: 82, name: 'San Sebastián de Yalí', stateId: 10 },
  { id: 83, name: 'El Cuá', stateId: 10 },
  { id: 84, name: 'La Concordia', stateId: 10 },
  { id: 85, name: 'San José de Bocay', stateId: 10 },
  { id: 86, name: 'Santa María de Pantasma', stateId: 10 },
  { id: 87, name: 'Wiwilí de Jinotega', stateId: 10 },

  // Cities of Madriz
  { id: 88, name: 'Somoto', stateId: 11 },
  { id: 89, name: 'Totogalpa', stateId: 11 },
  { id: 90, name: 'Telpaneca', stateId: 11 },
  { id: 91, name: 'San Juan de Río Coco', stateId: 11 },
  { id: 92, name: 'Palacagüina', stateId: 11 },
  { id: 93, name: 'Yalagüina', stateId: 11 },
  { id: 94, name: 'San Lucas', stateId: 11 },
  { id: 95, name: 'Las Sabanas', stateId: 11 },
  { id: 96, name: 'San José de Cusmapa', stateId: 11 },

  // Cities of Boaco
  { id: 97, name: 'Boaco', stateId: 12 },
  { id: 98, name: 'Camoapa', stateId: 12 },
  { id: 99, name: 'San Lorenzo', stateId: 12 },
  { id: 100, name: 'Teustepe', stateId: 12 },
  { id: 101, name: 'San José de los Remates', stateId: 12 },
  { id: 102, name: 'Santa Lucía', stateId: 12 },

  // Cities of Chontales
  { id: 103, name: 'Juigalpa', stateId: 13 },
  { id: 104, name: 'Acoyapa', stateId: 13 },
  { id: 105, name: 'Comalapa', stateId: 13 },
  { id: 106, name: 'Cuapa', stateId: 13 },
  { id: 107, name: 'El Coral', stateId: 13 },
  { id: 108, name: 'La Libertad', stateId: 13 },
  { id: 109, name: 'San Pedro de Lóvago', stateId: 13 },
  { id: 110, name: 'Santo Domingo', stateId: 13 },
  { id: 111, name: 'Santo Tomás', stateId: 13 },
  { id: 112, name: 'Villa Sandino', stateId: 13 },

  // Cities of Río San Juan
  { id: 113, name: 'San Carlos', stateId: 14 },
  { id: 114, name: 'San Miguelito', stateId: 14 },
  { id: 115, name: 'Morrito', stateId: 14 },
  { id: 116, name: 'El Almendro', stateId: 14 },
  { id: 117, name: 'El Castillo', stateId: 14 },
  { id: 118, name: 'San Juan del Norte', stateId: 14 },

  // Cities of Nueva Segovia
  { id: 119, name: 'Ocotal', stateId: 15 },
  { id: 120, name: 'Dipilto', stateId: 15 },
  { id: 121, name: 'Ciudad Antigua', stateId: 15 },
  { id: 122, name: 'Mozonte', stateId: 15 },
  { id: 123, name: 'Macuelizo', stateId: 15 },
  { id: 124, name: 'El Jícaro', stateId: 15 },
  { id: 125, name: 'Murra', stateId: 15 },
  { id: 126, name: 'Jalapa', stateId: 15 },
  { id: 127, name: 'Quilalí', stateId: 15 },
  { id: 128, name: 'San Fernando', stateId: 15 },
  { id: 129, name: 'Santa María', stateId: 15 },
  { id: 130, name: 'Wiwilí de Nueva Segovia', stateId: 15 },

  // Cities of the RACCN
  { id: 131, name: 'Puerto Cabezas', stateId: 16 },
  { id: 132, name: 'Waspán', stateId: 16 },
  { id: 133, name: 'Siuna', stateId: 16 },
  { id: 134, name: 'Rosita', stateId: 16 },
  { id: 135, name: 'Bonanza', stateId: 16 },
  { id: 136, name: 'Mulukukú', stateId: 16 },
  { id: 137, name: 'Prinzapolka', stateId: 16 },

  // Cities of the RACCS
  { id: 138, name: 'Bluefields', stateId: 17 },
  { id: 139, name: 'El Rama', stateId: 17 },
  { id: 140, name: 'Nueva Guinea', stateId: 17 },
  { id: 141, name: 'Corn Island', stateId: 17 },
  { id: 142, name: 'Laguna de Perlas', stateId: 17 },
  { id: 143, name: 'Desembocadura de Río Grande', stateId: 17 },
  { id: 144, name: 'El Tortuguero', stateId: 17 },
  { id: 145, name: 'Kukra Hill', stateId: 17 },
  { id: 146, name: 'La Cruz de Río Grande', stateId: 17 },
  { id: 147, name: 'Muelle de los Bueyes', stateId: 17 },
  { id: 148, name: 'Paiwas', stateId: 17 }
];

const handleSelectState = (item) => {
  setState(item.name);
  setModalStateVisible(false);

  // Filter cities based on the selected state
  const filteredCities = cities.filter(c => c.stateId === item.id);
  setFilteredCities(filteredCities);
};

const handleSelectCity = (item) => {
  setCity(item.name);
  setModalCityVisible(false);
};

const pickImage = async (setImageFunction) => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Permission Denied', 'Camera permissions are required to take photos.');
    return;
  }

  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: false, // Cambiado a false para no permitir edición
    quality: 1,
  });

  if (!result.canceled) {
    const uri = result.assets[0].uri;
    setImageFunction(uri);
    const imageUrl = await uploadImageToStorage(uri); // Upload the image to Firebase Storage
    return imageUrl; // Return the image URL
  }
};

const uploadImageToStorage = async (uri) => {
  const storage = getStorage();
  const response = await fetch(uri);
  const blob = await response.blob();
  const filename = uri.substring(uri.lastIndexOf('/') + 1);
  const storageRef = ref(storage, `images/${filename}`);

  await uploadBytes(storageRef, blob);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL; // Return the download URL
};


const handleRegister = async () => {
  setIsLoading(true);
  const auth = getAuth();

  try {

    const trimmedEmail = email.trim();
    // Crear el usuario en Firebase
    const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
    const user = userCredential.user;

    // Guardar los datos del freelancer en Firestore
    const idFreelancer = `FreelancerId_${user.uid}`;
    await setDoc(doc(db, 'Freelancers', idFreelancer), {
      uid: user.uid,
      id: idFreelancer,
      firstName,
      lastName,
      username,
      email,
      idNum: idNumber,
      idFrontPhoto, // Aquí se guarda la URL de la foto frontal
      idBackPhoto,  // Aquí se guarda la URL de la foto trasera
      city,
      state,
      userType: 'freelancer',
      verified: false,
      regDate: new Date().toISOString(),
    });

    Alert.alert('Éxito', 'Registrado correctamente', [
      { text: 'OK', onPress: () => navigation.replace('Login') }
    ]);
  } catch (error) {
    Alert.alert('Error', 'No se pudo registrar: ' + error.message);
    console.error('Error', 'No se pudo registrar: ' + error.message);
  } finally {
    setIsLoading(false);
  }
};

// Manejar el cambio en el campo de correo electrónico
const handleEmailChange = (text) => {
  // Eliminar todos los espacios y convertir el texto a minúsculas
  const noSpacesEmail = text.replace(/\s+/g, '').toLowerCase();
  setEmail(noSpacesEmail);
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
            <View style={styles.selectorContainer}>
              <TouchableOpacity onPress={() => setModalStateVisible(true)} style={{ width: '48%', marginRight: '2%' }}>
                  <Text style={styles.selectorText}>{state || 'Departamento'}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                  onPress={() => {
                      if (!state) {
                          Alert.alert('Error', 'Por favor, elige un departamento primero.');
                      } else {
                          setModalCityVisible(true);
                      }
                  }} 
                  style={{ width: '48%' }}
              >
                  <Text style={styles.selectorText}>{city || 'Municipio'}</Text>
              </TouchableOpacity>
            </View>
            <ImagePickerButton onPress={async () => {
              const url = await pickImage(setIdFrontPhoto);
              if (url) {
                setIdFrontPhoto(url); // Store the image URL
              }
            }} iconName="id-card-o" buttonText="Cedula Frontal" />
            <PreviewImage uri={idFrontPhoto} />
            <ImagePickerButton onPress={async () => {
              const url = await pickImage(setIdBackPhoto);
              if (url) {
                setIdBackPhoto(url); // Store the image URL
              }
            }} iconName="id-card-o" buttonText="Cedula Atras" />
            <PreviewImage uri={idBackPhoto} />
            <TouchableOpacity onPress={handleRegister} style={styles.buttonRegister}>
              <Text style={styles.buttonTextRegister}>Registrar</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Modal for selecting state */}
        <SelectModal
          visible={modalStateVisible}
          onClose={() => setModalStateVisible(false)}
          data={states}
          onSelect={handleSelectState}
        />
        {/* Modal for selecting city */}
        <SelectModal
          visible={modalCityVisible}
          onClose={() => setModalCityVisible(false)}
          data={filteredCities} // Use filtered cities
          onSelect={handleSelectCity}
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
    backgroundColor: '#107acc',
    width: '100%',
    padding: 30,
    borderTopLeftRadius: 130,
    overflow: 'hidden',
    marginBottom: 340,
    
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
  textSuccess: {
    color: 'green',
  },
  selectorText: {
    padding: 10,
    color: 'white',
    backgroundColor: '#15297C',
    marginBottom: 10,
    textAlign: 'center',
    borderRadius: 50,
    width: '100%', // Mantener el ancho al 100%
    height: 40,
    fontWeight: 'bold',
  },
  selectorContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});

export default RegisterFreelancer2;
