import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

const ProposalModal = ({ visible, onClose, onSubmit }) => {
  const [precioPropuesta, setPrecioPropuesta] = useState('');
  const [mensajePropuesta, setMensajePropuesta] = useState('');

  const handleSubmit = () => {
    if (!precioPropuesta || !mensajePropuesta) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }

    onSubmit({ precio_propuesta: parseFloat(precioPropuesta), mensaje_propuesta: mensajePropuesta });
    setPrecioPropuesta('');
    setMensajePropuesta('');
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <Text style={styles.title}>Enviar Propuesta</Text>
        <TextInput
          style={styles.input}
          placeholder="Precio de la propuesta"
          keyboardType="numeric"
          value={precioPropuesta}
          onChangeText={setPrecioPropuesta}
        />
        <TextInput
          style={styles.input}
          placeholder="Mensaje"
          value={mensajePropuesta}
          onChangeText={setMensajePropuesta}
        />
        <Button title="Enviar" onPress={handleSubmit} />
        <Button title="Cancelar" onPress={onClose} color="red" />
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
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default ProposalModal;