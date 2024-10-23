import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import CustomTextInput from '../../utils/CustomText';

const SendProposal = ({ route }) => {
  
  const { projectId } = route.params; // Obtener el ID del proyecto desde la navegación
  const { freelancerId } = route.params; // Obtener el ID del freelancer de los parámetros de la ruta
  console.log('Freelancer ID en HomeScreenFreelancer:', freelancerId); // Verifica que el ID se recolecte correctamente
  const [proposalMessage, setProposalMessage] = React.useState('');
  const [proposedPrice, setProposedPrice] = React.useState('');



  const SendProposal = async () => {
    try {
      const propuesta = {
        projectID: projectId,
        freelancerID: freelancerId,
        proposalMessage: proposalMessage,
        proposedPrice: parseFloat(proposedPrice),
        proposalStatus: 'pendiente',
        proposalDate: new Date().toISOString(),
      };
      await addDoc(collection(db, 'Proposals'), propuesta);
      Alert.alert('Propuesta enviada');
    } catch (error) {
      console.error("Error al enviar la propuesta: ", error);
    }
  };
  

  return (
    <View>
      <Text>Enviar Propuesta</Text>
      <CustomTextInput
        placeholder="Mensaje de Propuesta"
        value={proposalMessage}
        onChangeText={setProposalMessage}
      />
      <CustomTextInput
        placeholder="Precio de Propuesta"
        value={proposedPrice}
        onChangeText={setProposedPrice}
        keyboardType="numeric"
      />
      <TouchableOpacity onPress={SendProposal}>
        <Text>Enviar Propuesta</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SendProposal;
