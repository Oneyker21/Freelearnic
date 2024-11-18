import React, { useEffect, useState } from 'react';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, Image, Button, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { db } from '../../connection/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Asegúrate de importar estos módulos
import * as ImagePicker from 'expo-image-picker'; // Importa ImagePicker
import { CustomTextInput, CustomPickerInput,CustomPicker,CustomTextInputLarge, CustomTextInputEditable } from '../../utils/inputs'; // Importa el nuevo componente


const PanelUserFreelancer = ({ route }) => {
  const navigation = useNavigation();
  const { freelancerId } = route.params;
  const [freelancerData, setFreelancerData] = useState(null);
  const [imageUri, setImageUri] = useState(null); // Para almacenar la URI de la imagen
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFreelancerData = async () => {
      const docRef = doc(db, 'Freelancers', freelancerId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFreelancerData(data);
        setImageUri(data.profilePic || null); // Establecer la imagen de perfil o null
      } else {
        console.log("No such document!");
      }
      setLoading(false);
    };

    fetchFreelancerData();
  }, [freelancerId]);

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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
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
        <Text style={styles.name}>Cristhian Cesar Vargas Martinez</Text>
        <Text style={styles.username}>Angelica_R</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Ionicons name="call-outline" size={24} color="gray" />
          <Text style={styles.infoText}>(505) 8859-9564</Text>
        </View>
        <View style={styles.infoItem}>
          <MaterialIcons name="email" size={24} color="gray" />
          <Text style={styles.infoText}>rodriguezrosa203@gmail.com</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Configuración</Text>

      <TouchableOpacity style={styles.menuItem}>
        <MaterialIcons name="assignment" size={24} color="black" />
        <Text style={styles.menuItemText}>Mis proyectos</Text>
        <MaterialIcons name="chevron-right" size={24} color="gray" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => navigation.navigate('FreelancerProfile', { freelancerId })}
      >
        <MaterialIcons name="person" size={24} color="black" />
        <Text style={styles.menuItemText}>Cuenta</Text>
        <MaterialIcons name="chevron-right" size={24} color="gray" />
      </TouchableOpacity>

      
      <TouchableOpacity style={styles.menuItem}>
        <Ionicons name="settings-outline" size={24} color="black" />
        <Text style={styles.menuItemText}>Ajustes</Text>
        <MaterialIcons name="chevron-right" size={24} color="gray" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}
        onPress={() => navigation.navigate('HomeScreen')}
      >        
        <MaterialIcons name="group-add" size={24} color="black" />
        <Text style={styles.menuItemText}>Cerra Sesión</Text>
        <MaterialIcons name="chevron-right" size={24} color="gray" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#2196F3',
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  username: {
    fontSize: 16,
    color: '#e0e0e0',
  },
  infoContainer: {
    padding: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuItemText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
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

export default PanelUserFreelancer;
  