import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { db } from '../../config/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { CustomTextInputEdit } from '../../utils/inputs'; // Asegúrate de que la ruta sea correcta

const FreelancerProfile = ({ route }) => {
  const { freelancerId } = route.params; // Obtener el ID del freelancer desde la navegación
  const [freelancerData, setFreelancerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editableData, setEditableData] = useState({}); // Para almacenar los datos editables

  useEffect(() => {
    const fetchFreelancerData = async () => {
      const docRef = doc(db, 'Freelancers', freelancerId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFreelancerData(data);
        setEditableData(data); // Inicializa los datos editables
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
      await updateDoc(docRef, editableData);
      Alert.alert('Perfil actualizado con éxito');
      setFreelancerData(editableData); // Actualiza los datos del freelancer
    } catch (error) {
      console.error("Error al actualizar el perfil: ", error);
      Alert.alert('Error al actualizar el perfil');
    }
  };

  if (loading) {
    return <Text>Cargando...</Text>;
  }

  if (!freelancerData) {
    return <Text>No se encontró información del freelancer.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: freelancerData.profilePic }} style={styles.profilePic} />
      <Text style={styles.name}>{freelancerData.firstName} {freelancerData.lastName}</Text>
      <Text style={styles.username}>@{freelancerData.username}</Text>
      <Text style={styles.email}>{freelancerData.email}</Text>
      <Text style={styles.description}>{freelancerData.description}</Text>

      <Text style={styles.sectionTitle}>Información Personal</Text>
      <TouchableOpacity
        value={editableData.city}
        onChangeText={(value) => handleInputChange('city', value)}
        placeholder="Ciudad"
      />
      <TouchableOpacity
        value={editableData.state}
        onChangeText={(value) => handleInputChange('state', value)}
        placeholder="Estado"
      />
      <TouchableOpacity
        value={editableData.level}
        onChangeText={(value) => handleInputChange('level', value)}
        placeholder="Nivel"
      />
      <TouchableOpacity
        value={editableData.profession}
        onChangeText={(value) => handleInputChange('profession', value)}
        placeholder="Profesión"
      />
      <TouchableOpacity
        value={editableData.professionalExp}
        onChangeText={(value) => handleInputChange('professionalExp', value)}
        placeholder="Experiencia Profesional"
      />
      <TouchableOpacity
        value={editableData.availability}
        onChangeText={(value) => handleInputChange('availability', value)}
        placeholder="Disponibilidad"
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
  profilePic: {
    marginTop: 20,
    width: 100,
    height: 100,
    backgroundColor: 'blue',
    borderRadius: 50,
    borderColor: 'white',
    alignSelf: 'center',
    marginBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  username: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
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
