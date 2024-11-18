import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, Alert, TouchableOpacity } from 'react-native';

const ProposalModal = ({ visible, onClose, onSubmit, clientId }) => {
  const [proposalPrice, setProposalPrice] = useState('');
  const [proposalMessage, setProposalMessage] = useState('');

  const handleSubmit = () => {
    if (!proposalPrice || !proposalMessage) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    onSubmit({
      proposedPrice: parseFloat(proposalPrice),
      proposalMessage: proposalMessage,
      client_id: clientId
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
            placeholder="¿Qué incluye tu propuesta?"
            value={proposalMessage}
            onChangeText={setProposalMessage}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Enviar</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
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
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    color: '#000',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  button: {
    backgroundColor: '#15297C',
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default ProposalModal;
