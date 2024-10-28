import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { db } from '../../config/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Asegúrate de importar estos módulos
import * as ImagePicker from 'expo-image-picker'; // Importa ImagePicker
import staticImage from '../../assets/Freelearnic.png'; // Ruta a la imagen estática

const FreelancerProfile = ({ route }) => {
  const { freelancerId } = route.params; // Obtener el ID del freelancer desde la navegación
  const [freelancerData, setFreelancerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editableData, setEditableData] = useState({}); // Para almacenar los datos editables
  const [imageUri, setImageUri] = useState(null); // Para almacenar la URI de la imagen seleccionada
  const staticImage = require('../../assets/Freelearnic.png');

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
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={handleImagePick} style={styles.profilePicContainer}>
          <Image
            source={imageUri ? { uri: imageUri } : staticImage} // Mostrar la imagen de perfil o la imagen estática
            style={styles.profilePic}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Información Personal</Text>
      
      <TextInput
        style={styles.input}
        value={editableData.city}
        onChangeText={(value) => handleInputChange('city', value)}
        placeholder="Ciudad"
      />
      <TextInput
        style={styles.input}
        value={editableData.state}
        onChangeText={(value) => handleInputChange('state', value)}
        placeholder="Estado"
      />
      <TextInput
        style={styles.input}
        value={editableData.level}
        onChangeText={(value) => handleInputChange('level', value)}
        placeholder="Nivel"
      />
      <TextInput
        style={styles.input}
        value={editableData.profession}
        onChangeText={(value) => handleInputChange('profession', value)}
        placeholder="Profesión"
      />
      <TextInput
        style={styles.input}
        value={editableData.professionalExp}
        onChangeText={(value) => handleInputChange('professionalExp', value)}
        placeholder="Experiencia Profesional"
      />
      <TextInput
        style={styles.input}
        value={editableData.availability}
        onChangeText={(value) => handleInputChange('availability', value)}
        placeholder="Disponibilidad"
      />
      <TextInput
        style={styles.input}
        value={editableData.description}
        onChangeText={(value) => handleInputChange('description', value)}
        placeholder="Descripción"
      />
      <TextInput
        style={styles.input}
        value={editableData.skills.join(', ')} // Permite la entrada de habilidades como texto
        onChangeText={(value) => handleInputChange('skills', value.split(',').map(skill => skill.trim()))}
        placeholder="Habilidades (separadas por comas)"
      />
      <TextInput
        style={styles.input}
        value={editableData.portfolio.join(', ')} // Permite la entrada de URLs como texto
        onChangeText={(value) => handleInputChange('portfolio', value.split(',').map(url => url.trim()))}
        placeholder="Portfolio (separadas por comas)"
      />
      <TextInput
        style={styles.input}
        value={editableData.certifications.join(', ')} // Permite la entrada de certificaciones como texto
        onChangeText={(value) => handleInputChange('certifications', value.split(',').map(cert => cert.trim()))}
        placeholder="Certificaciones (separadas por comas)"
      />
      <TextInput
        style={styles.input}
        value={editableData.languages.join(', ')} // Permite la entrada de idiomas como texto
        onChangeText={(value) => handleInputChange('languages', value.split(',').map(lang => lang.trim()))}
        placeholder="Idiomas (separados por comas)"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profilePicContainer: {
    alignItems: 'center',
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderColor: 'white',
    borderWidth: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default FreelancerProfile;
