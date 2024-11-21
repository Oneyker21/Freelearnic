import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../connection/firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';
import { CustomTextInput, CustomTextInputEditable,CustomTextInputLarge } from '../../utils/inputs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import * as ImageManipulator from 'expo-image-manipulator';

const ClientProfile = ({ route }) => {
  const { clientId } = route.params;
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editableData, setEditableData] = useState({});
  const [imageUri, setImageUri] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchClientData = async () => {
      const docRef = doc(db, 'Clients', clientId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setClientData(data);
        setEditableData(data);
        setImageUri(data.profilePic || null);
      } else {
        console.log("No such document!");
      }
      setLoading(false);
    };

    fetchClientData();
  }, [clientId]);

  const handleInputChange = (field, value) => {
    setEditableData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'Clients', clientId);
      const updatedData = { ...editableData, profilePic: imageUri };
      await updateDoc(docRef, updatedData);
      Alert.alert('Perfil actualizado con éxito');
      setClientData(updatedData);
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

      const manipulatedImage = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width: 800 } }],
        { compress: 0.7 }
      );

      const imageUrl = await uploadImageToStorage(manipulatedImage.uri);
      if (imageUrl) {
        setImageUri(imageUrl);
      }
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

    setIsLoading(true);

    try {
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error al cargar la imagen: ", error);
      Alert.alert("Error al cargar la imagen", error.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (!clientData) {
    return <Text>No se encontró información del cliente.</Text>;
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
          
          <TouchableOpacity onPress={pickImage}>
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
                Edita tu <Text>cuenta de</Text> <Text style={{ fontWeight: 'bold' }}>Cliente</Text>
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
                  value={editableData.state}
                  onChangeText={(value) => handleInputChange('state', value)}
                  placeholder="Estado"
                />
          

              <CustomTextInputLarge
                style={styles.input}
                value={editableData.clientDesc}
                onChangeText={(value) => handleInputChange('clientDesc', value)}
                placeholder="Descripción"
              />

              <CustomTextInputEditable
                style={styles.input}
                value={editableData.telephone}
                onChangeText={(value) => handleInputChange('telephone', value)}
                placeholder="Teléfono"
                keyboardType="phone-pad"
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
  // He mantenido los mismos estilos que en FreelancerProfile
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
  login: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'normal',
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
  placeholderImage: {
    width: 130,
    height: 130,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
    marginBottom: 10,
  },
});

export default ClientProfile;
