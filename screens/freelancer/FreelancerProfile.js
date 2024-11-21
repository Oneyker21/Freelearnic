import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../connection/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Asegúrate de importar estos módulos
import * as ImagePicker from 'expo-image-picker'; // Importa ImagePicker
import { CustomTextInput, CustomPickerInput,CustomPicker,CustomTextInputLarge, CustomTextInputEditable } from '../../utils/inputs'; // Importa el nuevo componente
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImageManipulator from 'expo-image-manipulator';

const FreelancerProfile = ({ route }) => {
  const { freelancerId } = route.params; // Obtener el ID del freelancer desde la navegación
  const [freelancerData, setFreelancerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editableData, setEditableData] = useState({}); // Para almacenar los datos editables
  const [imageUri, setImageUri] = useState(null); // Para almacenar la URI de la imagen
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  

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
      const updatedData = { 
        ...editableData, 
        profilePic: imageUri 
      };
      await updateDoc(docRef, updatedData);
      Alert.alert('Perfil actualizado con éxito');
      setFreelancerData(updatedData);
    } catch (error) {
      console.error("Error al actualizar el perfil: ", error);
      Alert.alert('Error al actualizar el perfil');
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Se requieren permisos para acceder a las fotos.');
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [1, 1],
      quality: 1,
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      let imageUri = result.assets[0].uri;
  
      // Redimensionar la imagen antes de cargarla
      const manipulatedImage = await ImageManipulator.manipulateAsync(
          imageUri,
          [{ resize: { width: 800 } }], // Cambia el tamaño a 800px de ancho
          { compress: 0.7 } // Compresión entre 0 y 1
      );
    }
  
    if (result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      console.log("URI de la imagen seleccionada:", imageUri);
      const imageUrl = await uploadImageToStorage(imageUri);
      if (imageUrl) {
        setImageUri(imageUrl); // Actualiza el estado con la nueva URL
      }
    } else {
      console.error("No se pudo obtener el URI de la imagen.");
    }
  };
  
  

  const uploadImageToStorage = async (uri) => {
    if (!uri) {
        Alert.alert("Error", "No se proporcionó URI para la imagen.");
        return null;
    }

    const storage = getStorage();
    const response = await fetch(uri);
    const blob = await response.blob();
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    const storageRef = ref(storage, `images/${filename}`);

    console.log("Cargando la imagen a Firebase...");
    setIsLoading(true); // Mostrar indicador de carga

    try {
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        console.log("Imagen cargada, URL de descarga: ", downloadURL);
        return downloadURL; // Retorna la URL de descarga
    } catch (error) {
        console.error("Error al cargar la imagen: ", error);
        Alert.alert("Error al cargar la imagen", error.message);
        return null;
    } finally {
        setIsLoading(false); // Ocultar indicador de carga
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
        <TouchableOpacity onPress={async () => {
              const url = await pickImage(setImageUri);
              if (url) {
                setImageUri(url); // Asegúrate de que el estado se actualiza con la nueva URL
              }
            }}>
              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={styles.logo}
                />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text>Seleccionar imagen</Text>
                </View>
                
              )}
            </TouchableOpacity>
          <View style={styles.containerView}>
            <View style={styles.login}>
              <Text style={styles.title}>
                Edita tu <Text>cuenta de</Text> <Text style={{ fontWeight: 'bold' }}>Freelancer</Text>
              </Text>
              <CustomTextInputEditable
                style={styles.input}
                value={editableData.firstName + ' ' + editableData.lastName}
                editable={false}
                placeholder="Nombre completo"
              />

              <CustomTextInputEditable
                style={styles.input}
                value={editableData.username}
                editable={false}
                placeholder="Nombre de usuario"
              />

              <CustomTextInputEditable
                style={styles.input}
                value={editableData.email}
                editable={false}
                placeholder="Correo electrónico"
              />

          <CustomTextInputEditable
            style={styles.input}
            value={editableData.city}
            onChangeText={(value) => handleInputChange('city', value)}
            placeholder="Ciudad"
          />
          <CustomTextInputEditable
            style={styles.input}
            value={editableData.telephone}
            onChangeText={(value) => handleInputChange('telephone', value)}
            placeholder="Teléfono"
            keyboardType="phone-pad"
          />
          <CustomTextInputEditable
            style={styles.input}
            value={editableData.state}
            onChangeText={(value) => handleInputChange('state', value)}
            placeholder="Estado"
          />
          
          <CustomPicker 
            selectedValue={editableData.level} 
            onValueChange={(value) => handleInputChange('level', value)} 
            items={[
              { label: "Seleccione el nivel", value: "" },
              { label: "Senior", value: "Senior" },
              { label: "Junior", value: "Junior" },
              { label: "Avanzado", value: "Avanzado" }
            ]}
            placeholder="Seleccione el nivel"
          />
                <CustomPicker
                  selectedValue={editableData.profession}
                  onValueChange={(value) => handleInputChange('profession', value)}
                  items={[
                    { label: "Seleccione la profesión", value: "" },
                    { label: "Programador", value: "Programador" },
                    { label: "Diseñador Gráfico", value: "Diseñador Gráfico" },
                    { label: "Especialista en Marketing Digital", value: "Especialista en Marketing Digital" },
                    { label: "Desarrollador de Software", value: "Desarrollador de Software" },
                    { label: "Administrador de Bases de Datos", value: "Administrador de Bases de Datos" },
                    { label: "Desarrollador Web", value: "Desarrollador Web" }
                  ]}
                  placeholder="Seleccione la profesión"
                />
          <CustomTextInputLarge
            value={editableData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            placeholder="Descripción"
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
    backgroundColor: '#15297C'
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
  largeInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    height: 100,
    textAlignVertical: 'top',
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default FreelancerProfile;
