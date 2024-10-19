import React, {useState } from 'react';
import {StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert ,Image} from 'react-native';
import { BlurView } from 'expo-blur';
import { doc, setDoc, collection } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../config/firebaseConfig';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Import the date picker
import { Picker } from '@react-native-picker/picker'; // Import the Picker
import { CustomTextInput } from '../../utils/inputs';


const CreateProject = ({ route }) => {
  const { clientId } = route.params; // Get the client ID from route parameters
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [endDate, setEndDate] = useState('');
  const [projectType, setProjectType] = useState(''); // State for the project type
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
        projectStatus: "Disponible",
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
          <CustomTextInput onChangeText={setTitle} value={title} placeholder="Titulo" />
          <CustomTextInput onChangeText={setDescription} value={description} placeholder="Descripción" />
          <CustomTextInput onChangeText={setMinPrice} value={minPrice} placeholder="Precio minimo" />
          <CustomTextInput onChangeText={setMaxPrice} value={maxPrice} placeholder="Precio maximo" />
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
            <Text style={styles.buttonTextRegister}>Publicar</Text>
          </TouchableOpacity>
        </View>
      </View>
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

  buttonTextRegister: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
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
    fontSize: 12,
    marginTop: 5,
    textAlign: 'justify',
    fontWeight: 'bold',
    top:-25,
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
});

export default CreateProject;
