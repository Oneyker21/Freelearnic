import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';


const ProposalModal = ({ visible, onClose, onSubmit, clientId }) => { // Accepts clientId as a prop
  const [proposalPrice, setProposalPrice] = useState('');
  const [proposalMessage, setProposalMessage] = useState('');

  const handleSubmit = () => {
    if (!proposalPrice || !proposalMessage) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    // Includes clientId in the proposal data
    onSubmit({ 
      proposedPrice: parseFloat(proposalPrice), 
      proposalMessage: proposalMessage,
      client_id: clientId // Adds the clientId here
    });
    setProposalPrice('');
    setProposalMessage('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Envio de propuesta</Text>
          <TextInput
            style={styles.input}
            placeholder="Precio"
            keyboardType="numeric"
            value={proposalPrice}
            onChangeText={setProposalPrice}
          />
          <TextInput
            style={styles.input}
            placeholder="Mensaje"
            value={proposalMessage}
            onChangeText={setProposalMessage}
          />
          <View style={styles.buttonContainer}>
            <Button title="Enviar" onPress={handleSubmit} color='#15297C' />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Cancelar" onPress={onClose} color="red" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fondo semi-transparente
  },
  modalContent: {
    width: '80%', // Ancho del modal
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5, // Sombra para Android
    shadowColor: '#000', // Sombra para iOS
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#15297C',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    color: '#000', // Color del texto
  },
  buttonContainer: {
    marginVertical: 10,
  },
});

export default ProposalModal;
