import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

const SendProposal = ({ route }) => {
  const { projectId } = route.params; // Obtener el ID del proyecto desde la navegación
  const [mensajePropuesta, setMensajePropuesta] = React.useState('');
  const [precioPropuesta, setPrecioPropuesta] = React.useState('');

  const enviarPropuesta = async () => {
    try {
      const nuevaPropuesta = {
        id_freelancer: "id_freelancer_1", // Cambiar según el freelancer
        precio_propuesta: parseFloat(precioPropuesta),
        mensaje_propuesta,
        estado_propuesta: "pendiente",
        fecha_propuesta: new Date().toISOString()
      };

      // Actualizar el proyecto con la nueva propuesta
      const proyectoRef = doc(db, 'Proyecto', projectId);
      await updateDoc(proyectoRef, {
        propuestas: [...(await proyectoRef.get()).data().propuestas, nuevaPropuesta] // Agregar la propuesta al proyecto
      });

      Alert.alert('Éxito', 'Propuesta enviada correctamente');
      setMensajePropuesta('');
      setPrecioPropuesta('');
    } catch (error) {
      console.error('Error al enviar la propuesta: ', error);
      Alert.alert('Error', 'No se pudo enviar la propuesta: ' + error.message);
    }
  };

  return (
    <View>
      <Text>Enviar Propuesta</Text>
      <TextInput
        placeholder="Mensaje de Propuesta"
        value={mensajePropuesta}
        onChangeText={setMensajePropuesta}
      />
      <TextInput
        placeholder="Precio de Propuesta"
        value={precioPropuesta}
        onChangeText={setPrecioPropuesta}
        keyboardType="numeric"
      />
      <TouchableOpacity onPress={enviarPropuesta}>
        <Text>Enviar Propuesta</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SendProposal;
