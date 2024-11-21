import React, { useEffect, useState } from 'react';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { View, Text, StyleSheet, Image, Button, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { db } from '../../connection/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { doc, getDoc, updateDoc, onSnapshot } from 'firebase/firestore';
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
    const docRef = doc(db, 'Freelancers', freelancerId);
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setFreelancerData(data);
        setImageUri(data.profilePic || null);
      } else {
        console.log("No such document!");
      }
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, [freelancerId]);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.placeholderImage}>
              <MaterialIcons name="person" size={40} color="#fff" />
            </View>
          )}
        </View>
        <Text style={styles.name}>
          {freelancerData ? `${freelancerData.firstName} ${freelancerData.lastName}` : 'Cargando...'}
        </Text>
        <Text style={styles.username}>
          {freelancerData ? freelancerData.username : 'Cargando...'}
        </Text>
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Ionicons name="call-outline" size={24} color="gray" />
          <Text style={styles.infoText}>
            {freelancerData ? freelancerData.telephone || 'No disponible' : 'Cargando...'}
          </Text>
        </View>
        <View style={styles.infoItem}>
          <MaterialIcons name="email" size={24} color="gray" />
          <Text style={styles.infoText}>
            {freelancerData ? freelancerData.email : 'Cargando...'}
          </Text>
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
        <MaterialIcons name="logout" size={24} color="black" />
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
    paddingTop: 40,
  },
  profileImageContainer: {
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#fff',
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  username: {
    fontSize: 16,
    color: '#e0e0e0',
    marginTop: 5,
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PanelUserFreelancer;
  