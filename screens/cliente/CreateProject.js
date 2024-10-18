import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from 'react-native-modal-datetime-picker'; // Importar el selector de fechas
import { Picker } from '@react-native-picker/picker'; // Importar el Picker
import { useNavigation } from '@react-navigation/native';

const CreateProject = ({ route }) => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const { clientId } = route.params || {}; // Asegúrate de que clientId puede ser undefined
  console.log('Cliente id en createproject:', clientId);
  const [titulo, setTitulo] = React.useState('');
  const [descripcion, setDescripcion] = React.useState('');
  const [precioMinimo, setPrecioMinimo] = React.useState('');
  const [precioMaximo, setPrecioMaximo] = React.useState('');
  const [fechaFin, setFechaFin] = React.useState('');
  const [tipoProyecto, setTipoProyecto] = React.useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = React.useState(false);

  if (!clientId) {
    // Si no hay clientId, no renderizar nada o redirigir
    useEffect(() => {
      navigation.navigate('Login'); // Asegúrate de que 'Login' es el nombre correcto de la pantalla de inicio de sesión
    }, []);
    return null; // No renderizar nada mientras se redirige
  }

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setFechaFin(date.toISOString().split('T')[0]);
    hideDatePicker();
  };

  const handlePrecioMinimoChange = (text) => {
    const filteredText = text.replace(/[^0-9.]/g, '');
    setPrecioMinimo(filteredText);
  };

  const handlePrecioMaximoChange = (text) => {
    const filteredText = text.replace(/[^0-9.]/g, '');
    setPrecioMaximo(filteredText);
  };

  const crearProyecto = async () => {
    try {
      const nuevoProyecto = {
        id_cliente: clientId,
        titulo,
        descripcion_proyecto: descripcion,
        estado_proyecto: "activo",
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_estimada_entrega: fechaFin,
        fecha_finalizacion: null,
        tipo_proyecto: tipoProyecto,
        precio_minimo: parseFloat(precioMinimo),
        precio_maximo: parseFloat(precioMaximo),
        precio_final: parseFloat(precioMinimo),
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
    setTipoProyecto('');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <BlurView intensity={50} style={styles.blurContainer}>
          <View style={styles.login}>
            <Text style={styles.title}>Crear Proyecto</Text>
            <TextInput
              style={styles.input}
              placeholder="Título del proyecto"
              value={titulo}
              onChangeText={setTitulo}
            />
            <TextInput
              style={[styles.input, styles.descripcionInput]}
              placeholder="Descripción del proyecto"
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
            />
            <TextInput
              style={styles.input}
              placeholder="Precio mínimo"
              value={precioMinimo}
              onChangeText={handlePrecioMinimoChange}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Precio máximo"
              value={precioMaximo}
              onChangeText={handlePrecioMaximoChange}
              keyboardType="numeric"
            />
            <TouchableOpacity onPress={showDatePicker} style={styles.buttonRegister}>
              <Text style={styles.buttonTextRegister}>Seleccionar fecha de entrega</Text>
            </TouchableOpacity>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />
            <Picker
              selectedValue={tipoProyecto}
              onValueChange={(itemValue, itemIndex) => setTipoProyecto(itemValue)}
              style={styles.picker}
            >
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
    height: 100,
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
