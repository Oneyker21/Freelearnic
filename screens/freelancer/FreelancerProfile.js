import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../connection/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Asegúrate de importar estos módulos
import * as ImagePicker from 'expo-image-picker'; // Importa ImagePicker
import { CustomTextInput } from '../../utils/inputs';
import Ionicons from 'react-native-vector-icons/Ionicons';

const FreelancerProfile = ({ route }) => {
  const { freelancerId } = route.params; // Obtener el ID del freelancer desde la navegación
  const [freelancerData, setFreelancerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editableData, setEditableData] = useState({}); // Para almacenar los datos editables
  const [imageUri, setImageUri] = useState(null); // Para almacenar la URI de la imagen
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const staticImage = require('../../assets/img/Freelearnic.png');

  useEffect(() => {
    const fetchFreelancerData = async () => {
      const docRef = doc(db, 'Freelancers', freelancerId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFreelancerData(data);
        setEditableData(data); // Inicializa los datos editables
        setImageUri(data.profilePic || null); // Establecer la imagen de perfil o null
      } else {
        console.log("No such document!");
      }
      setLoading(false);
    };

    fetchFreelancerData();
  }, [freelancerId]);

  const handleInputChange = (field, value) => {
    setEditableData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'Freelancers', freelancerId);
      const updatedData = { ...editableData, profilePic: imageUri }; // Asegúrate de incluir la imagen de perfil
      await updateDoc(docRef, updatedData);
      Alert.alert('Perfil actualizado con éxito');
      setFreelancerData(updatedData); // Actualiza los datos del freelancer
    } catch (error) {
      console.error("Error al actualizar el perfil: ", error);
      Alert.alert('Error al actualizar el perfil');
    }
  };

  const handleImagePick = async () => {
    try {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert('Se requieren permisos para acceder a la galería');
            return;
        }

        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (pickerResult.cancelled) {
            return;
        }

        const downloadURL = await uploadImageToStorage(pickerResult.uri);
        setImageUri(downloadURL);
    } catch (error) {
        console.error("Error al seleccionar o cargar la imagen: ", error);
        Alert.alert('Error al seleccionar o cargar la imagen');
    }
};


const uploadImageToStorage = async (uri) => {
  try {
    const response = await fetch(uri, { timeout: 60000 }); // Agrega un tiempo de espera de 60 segundos
    const blob = await response.blob();
    const filename = `profile_images/${Date.now()}_${uri.substring(uri.lastIndexOf('/') + 1)}`;
    const storageRef = ref(getStorage(), filename);

    const snapshot = await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error al cargar la imagen:", error);
    Alert.alert("Error al cargar la imagen", error.message);
    throw error;
  }
};



  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!freelancerData) {
    return <Text>No se encontró información del freelancer.</Text>;
  }

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Image 
            source={require('../../assets/img/loading.png')}
            style={styles.loadingImage}
            resizeMode="contain"
          />
        </View>
      ) : (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={30} color="#15297C" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleImagePick}>
          <Image source={imageUri ? { uri: imageUri } : require('../../assets/img/usuario.png')} style={styles.logo} />
        </TouchableOpacity>
          <View style={styles.containerView}>
            <View style={styles.login}>
              <Text style={styles.title}>
                Edita tu <Text>cuenta de</Text> <Text style={{ fontWeight: 'bold' }}>Freelancer</Text>
              </Text>
          <CustomTextInput
            style={styles.input}
            value={editableData.city}
            onChangeText={(value) => handleInputChange('city', value)}
            placeholder="Ciudad"
          />
          <CustomTextInput
            style={styles.input}
            value={editableData.state}
            onChangeText={(value) => handleInputChange('state', value)}
            placeholder="Estado"
          />
          <CustomTextInput
            style={styles.input}
            value={editableData.level}
            onChangeText={(value) => handleInputChange('level', value)}
            placeholder="Nivel"
          />
          <CustomTextInput
            style={styles.input}
            value={editableData.profession}
            onChangeText={(value) => handleInputChange('profession', value)}
            placeholder="Profesión"
          />
          <CustomTextInput
            style={styles.input}
            value={editableData.professionalExp}
            onChangeText={(value) => handleInputChange('professionalExp', value)}
            placeholder="Experiencia Profesional"
          />
          <CustomTextInput
            style={styles.input}
            value={editableData.availability}
            onChangeText={(value) => handleInputChange('availability', value)}
            placeholder="Disponibilidad"
          />
          <CustomTextInput
            style={styles.input}
            value={editableData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            placeholder="Descripción"
          />
          <CustomTextInput
            style={styles.input}
            value={editableData.skills.join(', ')} // Permite la entrada de habilidades como texto
            onChangeText={(value) => handleInputChange('skills', value.split(',').map(skill => skill.trim()))}
            placeholder="Habilidades (separadas por comas)"
          />
          <CustomTextInput
            style={styles.input}
            value={editableData.portfolio.join(', ')} // Permite la entrada de URLs como texto
            onChangeText={(value) => handleInputChange('portfolio', value.split(',').map(url => url.trim()))}
            placeholder="Portfolio (separadas por comas)"
          />
          <CustomTextInput
            style={styles.input}
            value={editableData.certifications.join(', ')} // Permite la entrada de certificaciones como texto
            onChangeText={(value) => handleInputChange('certifications', value.split(',').map(cert => cert.trim()))}
            placeholder="Certificaciones (separadas por comas)"
          />
          <CustomTextInput
            style={styles.input}
            value={editableData.languages.join(', ')} // Permite la entrada de idiomas como texto
            onChangeText={(value) => handleInputChange('languages', value.split(',').map(lang => lang.trim()))}
            placeholder="Idiomas (separados por comas)"
          />

              <TouchableOpacity style={styles.buttonRegister} onPress={handleSave}>
                <Text style={styles.buttonTextRegister}>Guardar Cambios</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};
   
const styles = StyleSheet.create({
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
  buttonTextRegister: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
  container: {
    flex: 1,
    paddingTop: 50,
    position: 'relative',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingImage: {
    width: 100,
    height: 100,
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
  backButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  containerView: {
    backgroundColor: '#107acc',
    width: '100%',
    padding: 20,
    borderTopLeftRadius: 130,
    overflow: 'hidden',
  },
  profile: {
    width: '80%',
    padding: 20,
    borderWidth: 2,
    borderColor: '#15297C',
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 16,
    fontWeight: 'none',
    marginBottom: 20,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowRadius: 1,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  saveButton: {
    width: '100%',
    height: 50,
    marginTop: 30,
    backgroundColor: '#15297C',
    borderRadius: 50,
    marginBottom: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

export default FreelancerProfile;
