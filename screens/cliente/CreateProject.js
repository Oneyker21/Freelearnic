import React from 'react';
import { Image, StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { BlurView } from 'expo-blur';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome'; // Importar los iconos

const CreateProject = () => {
  const [titulo, setTitulo] = React.useState('');
  const [descripcion, setDescripcion] = React.useState('');
  const [precio, setPrecio] = React.useState('');
  const [fechaInicio, setFechaInicio] = React.useState('');
  const [fechaFin, setFechaFin] = React.useState('');

  const crearProyecto = async () => {
    try {
      const nuevoProyecto = {
        id_cliente: "id_cliente_1", // Cambiar según el cliente
        id_freelancer: "id_freelancer_1", // Cambiar según el freelancer
        titulo,
        descripcion_proyecto: descripcion,
        estado_proyecto: "activo",
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        precio: parseFloat(precio),
        monto_escrow: parseFloat(precio) * 0.67 // Ejemplo de cálculo
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
    setPrecio('');
    setFechaInicio('');
    setFechaFin('');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <BlurView intensity={90} tint="light" style={styles.blurContainer}>
          <View style={styles.login}>
            <Text style={styles.title}>Crear Proyecto</Text>
            <TextInput style={styles.input} onChangeText={setTitulo} value={titulo} placeholder="Título" />
            <TextInput style={styles.input} onChangeText={setDescripcion} value={descripcion} placeholder="Descripción" />
            <TextInput style={styles.input} onChangeText={setPrecio} value={precio} placeholder="Precio" keyboardType="numeric" />
            <TextInput style={styles.input} onChangeText={setFechaInicio} value={fechaInicio} placeholder="Fecha Inicio" />
            <TextInput style={styles.input} onChangeText={setFechaFin} value={fechaFin} placeholder="Fecha Fin" />

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
