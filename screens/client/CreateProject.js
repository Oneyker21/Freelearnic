import React, {useState } from 'react';
import {StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { doc, setDoc, collection } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../config/firebaseConfig';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Import the date picker
import { Picker } from '@react-native-picker/picker'; // Import the Picker

const CreateProject = ({ route }) => {
  const { clientId } = route.params; // Get the client ID from route parameters
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [endDate, setEndDate] = useState('');
  const [projectType, setProjectType] = useState(''); // State for the project type
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const navigation = useNavigation();

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setEndDate(date.toISOString().split('T')[0]); // Date format
    hideDatePicker();
  };

  const handleMinPriceChange = (text) => {
    const filteredText = text.replace(/[^0-9.]/g, ''); // Only allow numbers and dot
    setMinPrice(filteredText);
  };

  const handleMaxPriceChange = (text) => {
    const filteredText = text.replace(/[^0-9.]/g, ''); // Only allow numbers and dot
    setMaxPrice(filteredText);
  };

  const createProject = async () => {
    try {
      const projectRef = doc(collection(db, 'Projects')); // Crea una referencia a un nuevo documento en la colección 'Projects'
      const ProjectId = `ProjectId_${projectRef.id}`; // Genera un ID personalizado

      await setDoc(projectRef, { // Usa la referencia para establecer el documento
        id: ProjectId, // Usa el ID personalizado
        clientID: clientId, // ID del cliente asociado
        title,
        description: description,
        projectStatus: "active",
        startDate: new Date().toISOString().split('T')[0], // Fecha de inicio generada automáticamente
        estimatedDeliveryDate: endDate, // Fecha estimada de entrega
        completionDate: null, // Inicialmente nulo
        projectType: projectType, // Tipo de proyecto seleccionado
        minPrice: parseFloat(minPrice), // Precio mínimo
        maxPrice: parseFloat(maxPrice), // Precio máximo
        finalPrice: parseFloat(minPrice), // Precio final
      });

      // Cambiar el Alert para que el segundo argumento sea un string
      Alert.alert('Proyecto registrado', 'El proyecto se ha creado correctamente.', [
        { text: 'OK', onPress: () => navigation.replace('HomeScreenClient',{ clientId })}
      ]);
    } catch (error) {
      console.error('Error creating project: ', error);
      Alert.alert('Error', 'No se pudo crear el proyecto: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <BlurView intensity={90} tint="light" style={styles.blurContainer}>
          <View style={styles.login}>
            <Text style={styles.title}>Crear un proyecto</Text>
            <TextInput style={styles.input} onChangeText={setTitle} value={title} placeholder="Titulo" />
            <TextInput 
              style={[styles.input, styles.descriptionInput]} 
              onChangeText={setDescription} 
              value={description} 
              placeholder="Descripción" 
              multiline 
              numberOfLines={4} // Number of visible lines
              textAlignVertical="top" // Align text at the top
            />
            <TextInput 
              style={styles.input} 
              onChangeText={handleMinPriceChange} 
              value={minPrice} 
              placeholder="Precio minimo" 
              keyboardType="numeric" 
            />
            <TextInput 
              style={styles.input} 
              onChangeText={handleMaxPriceChange} 
              value={maxPrice} 
              placeholder="Precio maximo" 
              keyboardType="numeric" 
            />
            
            <TouchableOpacity onPress={showDatePicker} style={styles.input}>
              <Text>{endDate ? endDate : "Tiempo estimado de entrega"}</Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              minimumDate={new Date()} // Only allow future dates
            />

            {/* Project type selector */}
            <Picker
              selectedValue={projectType}
              style={styles.picker}
              onValueChange={(itemValue) => setProjectType(itemValue)}
            >
              <Picker.Item label="Seleccione el tipo de proyecto" value="" />
              <Picker.Item label="Programación" value="Programación" />
              <Picker.Item label="Diseño gráfico" value="Diseño gráfico" />
              <Picker.Item label="Marketing digital" value="Marketing digital" />
              <Picker.Item label="Desarrollo de software" value="Desarrollo de software" />
              <Picker.Item label="Base de datos" value="Base de datos" />
            </Picker>

            <TouchableOpacity onPress={createProject} style={styles.buttonRegister}>
              <Text style={styles.buttonTextRegister}>Crear proyecto</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  blurContainer: {
    width: '80%',
    padding: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  login: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 5,
    marginBottom: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionInput: {
    height: 100, // Increased height for the description field
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonRegister: {
    width: '100%',
    height: 40,
    backgroundColor: '#E6F3FF',
    borderRadius: 5,
    borderColor: '#007AFF',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextRegister: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
});

export default CreateProject;
