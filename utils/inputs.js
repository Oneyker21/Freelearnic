import React from 'react';
import { TextInput, TouchableOpacity, StyleSheet, View, Text, Image, Modal, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

// Componente personalizado para entradas de texto con opción de mostrar/ocultar contraseña
export const CustomTextInput = ({ value, onChangeText, placeholder, secureTextEntry = false, showPassword, toggleShowPassword }) => (
  <View style={styles.inputContainer}>
    <TextInput
      style={styles.input}
      onChangeText={onChangeText}
      value={value}
      placeholder={placeholder}
      placeholderTextColor="#fff"
      secureTextEntry={secureTextEntry && !showPassword}
    />
    {secureTextEntry && (
      <TouchableOpacity onPress={toggleShowPassword} style={styles.eyeIcon}>
        <Icon name={showPassword ? "eye" : "eye-slash"} size={20} color="#fff" />
      </TouchableOpacity>
    )}
  </View>
);


export const CustomTextInputEdit = ({ value, onChangeText, placeholder, editable, onEdit }) => (
  <View style={styles.inputContainer2}>
    <TextInput
      style={styles.inputtext}
      onChangeText={onChangeText}
      value={value}
      placeholder={placeholder}
      placeholderTextColor="#ccc"
      editable={editable} // Controla si el campo es editable
    />
    {editable && (
      <TouchableOpacity onPress={onEdit} style={styles.editButton}>
        <Icon name="edit" size={20} color="#007AFF" />
      </TouchableOpacity>
    )}
  </View>
);

// Componente personalizado para el input del selector de fecha
export const CustomPickerInput = ({ value, onPress, placeholder }) => (
  <TouchableOpacity onPress={onPress} style={styles.inputContainer}>
    <Text style={styles.inputText}>{value ? value : placeholder}</Text>
  </TouchableOpacity>
);

// Componente personalizado para botones que activan la selección de imágenes
export const ImagePickerButton = ({ onPress, iconName, buttonText }) => (
  <TouchableOpacity style={styles.imageButton} onPress={onPress}>
    <Icon name={iconName} size={20} color="#fff" style={styles.icon} />
    <Text style={styles.imageButtonText}>{buttonText}</Text>
  </TouchableOpacity>
);

// Componente para mostrar una imagen previa seleccionada
export const PreviewImage = ({ uri }) => (
  uri ? <Image source={{ uri }} style={styles.previewImage} /> : null
);


// Componente personalizado para el selector de tipo de proyecto
export const CustomPicker = ({ selectedValue, onValueChange, items, placeholder }) => {
  const [modalVisible, setModalVisible] = React.useState(false);

  const handleSelect = (item) => {
    onValueChange(item.value);
    setModalVisible(false);
  };

  return (
    <View style={styles.pickerContainer}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.pickerInput}>
        <Text style={styles.pickerText}>{selectedValue ? selectedValue : placeholder}</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <FlatList
              data={items}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleSelect(item)} style={styles.modalItem}>
                  <Text style={styles.modalItemText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

// Estilos para los componentes
const styles = StyleSheet.create({
  editButton:{
color: 'black',
padding: 10,
  },
  inputtext:{
  color: 'black'


  },
  inputContainer2:{
    padding: 15,
    borderWidth: 1,
    borderColor: '#fff', // Cambiado a blanco para coincidir con otros inputs
    borderRadius: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#fff',
    marginBottom: 25,
    width: '100%',
    height: 40,
    justifyContent: 'center', // Centrar el texto
  },
  input: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 10,
    color: '#fff',
  },
  inputText: {
    color: '#fff', // Color del texto para el CustomPickerInput
    flex: 1,
    textAlign: 'center', // Centrar el texto
  },
  eyeIcon: {
    padding: 10,
  },
  imageButton: {
    flex: 1,
    height: 40,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginRight: 5,
  },
  imageButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  previewImage: {
    width: 100,
    height: 100,
    marginBottom: 10,
    borderRadius: 5,
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 25,
  },
  pickerInput: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#fff', // Cambiado a blanco para coincidir con otros inputs
    borderRadius: 5,
    backgroundColor: '#107acc', // Color de fondo consistente
  },
  pickerText: {
    color: '#fff', // Color del texto para que coincida con otros inputs
    textAlign: 'center', // Centrar el texto
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    marginTop: 350, 
    width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalItem: {
    padding: 15,
    borderBottomColor: 'gray',
  },
  modalItemText: {
    color: 'black',
  },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
