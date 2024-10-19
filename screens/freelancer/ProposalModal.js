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
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
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
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    marginVertical: 10, // Ajusta el margen vertical para separar los botones
    // Puedes agregar más estilos aquí según necesites
  },
});

export default ProposalModal;
