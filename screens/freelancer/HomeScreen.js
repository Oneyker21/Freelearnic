import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProjectList from '../ProjectList'; // Asegúrate de que la ruta sea correcta

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Inicio de sesión')}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.buttonRegister}
          onPress={() => navigation.navigate('Registrar Cuenta')}
        >
          <Text style={styles.buttonTextRegister}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonVendedor}
          onPress={() => navigation.navigate('Registrar Freelancer')}
        >
          <Text style={styles.buttonTextVendedor}>Iniciar como vendedor</Text>
        </TouchableOpacity>
      </View>
      {/* Aquí se agrega el componente ProjectList para mostrar los proyectos */}
      <View style={styles.projectListContainer}>
        <ProjectList />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  buttonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    flexDirection: 'row',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonRegister: {
    backgroundColor: null,
    borderWidth: 1,
    borderColor: '#007AFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonTextRegister: {
    color: '#007AFF',
    fontWeight: 'bold',
  },
  buttonVendedor: {
    backgroundColor: '#4CAF50', // Color verde para distinguirlo
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonTextVendedor: {
    color: 'white',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  projectListContainer: {
    marginTop: 20, // Ajusta el margen superior según sea necesario
    width: '100%', // Asegúrate de que ocupe el ancho completo
  },
});

export default HomeScreen;
