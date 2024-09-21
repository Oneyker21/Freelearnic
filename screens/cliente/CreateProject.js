import React from 'react';
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Importar el selector de fechas
import { Picker } from '@react-native-picker/picker'; // Importar el Picker

const CreateProject = () => {
  const [titulo, setTitulo] = React.useState('');
  const [descripcion, setDescripcion] = React.useState('');
  const [precioMinimo, setPrecioMinimo] = React.useState('');
  const [precioMaximo, setPrecioMaximo] = React.useState('');
  const [fechaFin, setFechaFin] = React.useState('');
  const [tipoProyecto, setTipoProyecto] = React.useState(''); // Estado para el tipo de proyecto
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setFechaFin(date.toISOString().split('T')[0]); // Formato de fecha
    hideDatePicker();
  };

  const handlePrecioMinimoChange = (text) => {
    const filteredText = text.replace(/[^0-9.]/g, ''); // Solo permite números y punto
    setPrecioMinimo(filteredText);
  };

  const handlePrecioMaximoChange = (text) => {
    const filteredText = text.replace(/[^0-9.]/g, ''); // Solo permite números y punto
    setPrecioMaximo(filteredText);
  };

  const crearProyecto = async () => {
    try {
      const nuevoProyecto = {
        id_cliente: "id_cliente_1", // Cambiar según el cliente
        titulo,
        descripcion_proyecto: descripcion,
        estado_proyecto: "activo",
        fecha_inicio: new Date().toISOString().split('T')[0], // Fecha generada automáticamente
        fecha_estimada_entrega: fechaFin, // Cambiar a fecha estimada de entrega
        fecha_finalizacion: null, // Inicialmente nulo
        tipo_proyecto: tipoProyecto, // Tipo de proyecto seleccionado
        precio_minimo: parseFloat(precioMinimo), // Precio mínimo
        precio_maximo: parseFloat(precioMaximo), // Precio máximo
        precio_final: parseFloat(precioMinimo), // Precio final
        propuestas: [] // Inicializar el campo de propuestas
      };

      await setDoc(doc(db, 'Proyecto', `id_proyecto_${Date.now()}`), nuevoProyecto);
      Alert.alert('Éxito', 'Proyecto creado correctamente');
      limpiarCampos();
    } catch (error) {
      console.error('Error al crear el proyecto: ', error);
      Alert.alert('Error', 'No se pudo crear el proyecto: ' + error.message);
    }
  };

  const limpiarCampos = () => {
    setTitulo('');
    setDescripcion('');
    setPrecioMinimo('');
    setPrecioMaximo('');
    setFechaFin('');
    setTipoProyecto(''); // Limpiar el tipo de proyecto
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <BlurView intensity={90} tint="light" style={styles.blurContainer}>
          <View style={styles.login}>
            <Text style={styles.title}>Crear Proyecto</Text>
            <TextInput style={styles.input} onChangeText={setTitulo} value={titulo} placeholder="Título" />
            <TextInput 
              style={[styles.input, styles.descripcionInput]} 
              onChangeText={setDescripcion} 
              value={descripcion} 
              placeholder="Descripción" 
              multiline 
              numberOfLines={4} // Número de líneas visibles
              textAlignVertical="top" // Alinear el texto en la parte superior
            />
            <TextInput 
              style={styles.input} 
              onChangeText={handlePrecioMinimoChange} 
              value={precioMinimo} 
              placeholder="Precio Mínimo" 
              keyboardType="numeric" 
            />
            <TextInput 
              style={styles.input} 
              onChangeText={handlePrecioMaximoChange} 
              value={precioMaximo} 
              placeholder="Precio Máximo" 
              keyboardType="numeric" 
            />
            
            <TouchableOpacity onPress={showDatePicker} style={styles.input}>
              <Text>{fechaFin ? fechaFin : "Fecha Estimada de Entrega"}</Text>
            </TouchableOpacity>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
              minimumDate={new Date()} // Solo permitir fechas futuras
            />

            {/* Selector de tipo de proyecto */}
            <Picker
              selectedValue={tipoProyecto}
              style={styles.picker}
              onValueChange={(itemValue) => setTipoProyecto(itemValue)}
            >
              <Picker.Item label="Selecciona un tipo de proyecto" value="" />
              <Picker.Item label="Programación" value="programacion" />
              <Picker.Item label="Diseño Gráfico" value="diseno_grafico" />
              <Picker.Item label="Marketing Digital" value="marketing_digital" />
              <Picker.Item label="Desarrollo de Aplicaciones" value="desarrollo_aplicaciones" />
              <Picker.Item label="Escritura" value="escritura" />
            </Picker>

            <TouchableOpacity onPress={crearProyecto} style={styles.buttonRegister}>
              <Text style={styles.buttonTextRegister}>Crear Proyecto</Text>
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
  descripcionInput: {
    height: 100, // Altura aumentada para el campo de descripción
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
