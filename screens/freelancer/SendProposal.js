import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

const SendProposal = ({ route }) => {
  
  const { projectId } = route.params; // Obtener el ID del proyecto desde la navegación
  const { freelancerId } = route.params; // Obtener el ID del freelancer de los parámetros de la ruta
  console.log('Freelancer ID en HomeScreenFreelancer:', freelancerId); // Verifica que el ID se recolecte correctamente
  const [mensajePropuesta, setMensajePropuesta] = React.useState('');
  const [precioPropuesta, setPrecioPropuesta] = React.useState('');



  const enviarPropuesta = async () => {
    try {
      const propuesta = {
        id_proyecto: projectId,
        id_freelancer: freelancerId,
        mensaje_propuesta: mensajePropuesta,
        precio_propuesta: parseFloat(precioPropuesta),
        estado_propuesta: 'pendiente',
        fecha_propuesta: new Date().toISOString(),
      };
      await addDoc(collection(db, 'Propuestas'), propuesta);
      Alert.alert('Propuesta enviada');
    } catch (error) {
      console.error("Error al enviar la propuesta: ", error);
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
