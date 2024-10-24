import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { doc, setDoc, collection } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../config/firebaseConfig';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Import the date picker
import { CustomTextInput, CustomPickerInput,CustomPicker } from '../../utils/inputs'; // Importa el nuevo componente

const CreateProject = ({ route }) => {
  const { clientId } = route.params; // Get the client ID from route parameters
  const [title, setTitle] = useState('');
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
    // Validar que todos los campos estén llenos
    if (!title || !description || !minPrice || !maxPrice || !endDate || !projectType) {
      Alert.alert('Error', 'Por favor, completa todos los campos antes de registrar el proyecto.');
      return; // Salir de la función si hay campos vacíos
    }

    setIsLoading(true); // Establecer isLoading en true al inicio
    try {
      const projectRef = doc(collection(db, 'Projects')); // Crear una referencia a un nuevo documento en la colección 'Projects'
      const ProjectId = `ProjectId_${projectRef.id}`; // Generar un ID personalizado

      await setDoc(projectRef, { // Usar la referencia para establecer el documento
        id: ProjectId, // Usar el ID personalizado
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

      Alert.alert('Proyecto registrado', 'El proyecto se ha creado correctamente.', [
        { text: 'OK', onPress: () => {
            // Limpiar los campos después de registrar
            setTitle('');
            setDescription('');
            setMinPrice('');
            setMaxPrice('');
            setEndDate('');
            setProjectType('');
            navigation.navigate('HomeScreenClient', { clientId });
          }
        }
      ]);
    } catch (error) {
      console.error('Error creating project: ', error);
      Alert.alert('Error', 'No se pudo crear el proyecto: ' + error.message);
    } finally {
      setIsLoading(false); // Establecer isLoading en false al final
    }
  };

  return (
    <View style={styles.container}>
    {isLoading ? (
      <View style={styles.loadingContainer}>
        <Image 
          source={require('../../assets/loading.png')} // Asegúrate de que la ruta sea correcta
          style={styles.loadingImage}
          resizeMode="contain" // Ajusta la imagen para que se contenga dentro del área
        />
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
                <Text>Crea un proyecto</Text>
              </Text>
              <CustomTextInput onChangeText={setTitle} value={title} placeholder="Titulo" />
              <CustomTextInput onChangeText={setDescription} value={description} placeholder="Descripción" />
              <CustomTextInput onChangeText={handleMinPriceChange} value={minPrice} placeholder="Precio mínimo" />
              <CustomTextInput onChangeText={handleMaxPriceChange} value={maxPrice} placeholder="Precio máximo" />

              {/* Usar el nuevo CustomPicker */}
              <CustomPicker 
                selectedValue={projectType} 
                onValueChange={setProjectType} 
                items={[
                  { label: "Seleccione el tipo de proyecto", value: "" },
                  { label: "Programación", value: "Programación" },
                  { label: "Diseño Gráfico", value: "Diseño Gráfico" },
                  { label: "Marketing Digital", value: "Marketing Digital" },
                  { label: "Desarrollo de Software", value: "Desarrollo de Software" },
                  { label: "Base de datos", value: "Base de datos" },
                  { label: "Desarrollo Web", value: "Desarrollo Web" },
                ]}
                placeholder="Seleccione el tipo de proyecto"
              />

              {/* Usar el nuevo CustomPickerInput */}
              <CustomPickerInput 
                value={endDate} 
                onPress={showDatePicker} 
                placeholder="Tiempo estimado de entrega" 
              />

              <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                minimumDate={new Date()} // Only allow future dates
              />

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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor:'#107acc' 
  },
  loadingImage: {
    width: 160, // Ajusta el tamaño según sea necesario
    height: 160, // Ajusta el tamaño según sea necesario
    marginBottom: 10, // Espacio entre la imagen y el texto
  },
});

export default CreateProject;
