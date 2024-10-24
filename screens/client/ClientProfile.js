import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TextInput, Button, ScrollView } from 'react-native';
import { db } from '../../config/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const ClientProfile = ({ route }) => {
  const { freelancerId } = route.params; // Asegúrate de obtener el freelancerId de los parámetros de la ruta
  const [freelancerData, setFreelancerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editableData, setEditableData] = useState({
    portafolio: [],
    certificaciones: [],
    idiomas_hablados: [],
    habilidades: [],
    // otros campos...
  });

  // Estados para nuevos elementos de cada lista
  const [newPortfolioItem, setNewPortfolioItem] = useState('');
  const [newCertification, setNewCertification] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    const fetchFreelancerData = async () => {
      try {
        const docRef = doc(db, 'Freelancer', freelancerId); // Cambia 'Freelancer' por el nombre de tu colección
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setFreelancerData(data);
          setEditableData(data); // Inicializa editableData con los datos del freelancer
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching freelancer data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancerData();
  }, [freelancerId]);

  const addItemToList = (listName, item) => {
    setEditableData((prevData) => ({
      ...prevData,
      [listName]: [...prevData[listName], item],
    }));
  };

  const removeItemFromList = (listName, index) => {
    setEditableData((prevData) => ({
      ...prevData,
      [listName]: prevData[listName].filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    try {
      const docRef = doc(db, 'Freelancer', freelancerId);
      await updateDoc(docRef, editableData); // Actualiza los datos en Firestore
      setFreelancerData(editableData); // Actualiza freelancerData con los nuevos datos
    } catch (error) {
      console.error('Error updating freelancer data: ', error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  if (!freelancerData) {
    return <Text>No se encontraron datos del freelancer.</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{`${freelancerData.nombres} ${freelancerData.apellidos}`}</Text>
      {/* Campos editables */}
      <TextInput
        style={styles.input}
        placeholder="Nombre de Usuario"
        value={editableData.nombre_usuario}
        onChangeText={(value) => handleInputChange('nombre_usuario', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={editableData.descripcion}
        onChangeText={(value) => handleInputChange('descripcion', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Correo Electrónico"
        value={editableData.email}
        onChangeText={(value) => handleInputChange('email', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Número de Cédula"
        value={editableData.num_cedula}
        onChangeText={(value) => handleInputChange('num_cedula', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Nivel"
        value={editableData.nivel}
        onChangeText={(value) => handleInputChange('nivel', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Municipio"
        value={editableData.municipio}
        onChangeText={(value) => handleInputChange('municipio', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Departamento"
        value={editableData.departamento}
        onChangeText={(value) => handleInputChange('departamento', value)}
      />
      <TextInput
        style={styles.input}
        placeholder="Calificación Promedio"
        value={editableData.calificacion_promedio?.toString()} // Convertir a string para el input
        onChangeText={(value) => handleInputChange('calificacion_promedio', parseFloat(value))}
      />
      <TextInput
        style={styles.input}
        placeholder="Número de Trabajos Completados"
        value={editableData.num_trabajos_completados?.toString()} // Convertir a string para el input
        onChangeText={(value) => handleInputChange('num_trabajos_completados', parseInt(value))}
      />
      <TextInput
        style={styles.input}
        placeholder="Estado de Disponibilidad"
        value={editableData.estado_disponibilidad}
        onChangeText={(value) => handleInputChange('estado_disponibilidad', value)}
      />
      {/* Agrega más campos según sea necesario */}
      {/* Manejo de Portafolio */}
      <TextInput
        style={styles.input}
        placeholder="Agregar URL al Portafolio"
        value={newPortfolioItem}
        onChangeText={setNewPortfolioItem}
      />
      <Button
        title="Agregar al Portafolio"
        onPress={() => {
          addItemToList('portafolio', newPortfolioItem);
          setNewPortfolioItem('');
        }}
      />
      {editableData.portafolio.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text>{item}</Text>
          <Button title="Eliminar" onPress={() => removeItemFromList('portafolio', index)} />
        </View>
      ))}
      {/* Manejo de Certificaciones */}
      <TextInput
        style={styles.input}
        placeholder="Agregar Certificación"
        value={newCertification}
        onChangeText={setNewCertification}
      />
      <Button
        title="Agregar Certificación"
        onPress={() => {
          addItemToList('certificaciones', newCertification);
          setNewCertification('');
        }}
      />
      {editableData.certificaciones.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text>{item}</Text>
          <Button title="Eliminar" onPress={() => removeItemFromList('certificaciones', index)} />
        </View>
      ))}
      {/* Manejo de Idiomas Hablados */}
      <TextInput
        style={styles.input}
        placeholder="Agregar Idioma"
        value={newLanguage}
        onChangeText={setNewLanguage}
      />
      <Button
        title="Agregar Idioma"
        onPress={() => {
          addItemToList('idiomas_hablados', newLanguage);
          setNewLanguage('');
        }}
      />
      {editableData.idiomas_hablados.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text>{item}</Text>
          <Button title="Eliminar" onPress={() => removeItemFromList('idiomas_hablados', index)} />
        </View>
      ))}
      {/* Manejo de Habilidades */}
      <TextInput
        style={styles.input}
        placeholder="Agregar Habilidad"
        value={newSkill}
        onChangeText={setNewSkill}
      />
      <Button
        title="Agregar Habilidad"
        onPress={() => {
          addItemToList('habilidades', newSkill);
          setNewSkill('');
        }}
      />
      {editableData.habilidades.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text>{item}</Text>
          <Button title="Eliminar" onPress={() => removeItemFromList('habilidades', index)} />
        </View>
      ))}
      <Button title="Guardar Cambios" onPress={handleSave} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
});

export default ClientProfile;
