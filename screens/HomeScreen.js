import React from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProjectListSB from './ProjectListSB'; // Asegúrate de que la ruta sea correcta

const HomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Image source={require('../assets/superior.png')} style={styles.image} />
      <View style={styles.buttonContainer}>
        <View style={styles.welcomeContainer}>
          <View style={styles.tap}>
            <Image source={require('../assets/tap.png')} style={styles.logo} />
          </View>
          <Text style={styles.welcomeText}>¡En Freelearnic, tu próximo proyecto o 
          freelancer está a un clic de distancia!</Text>
          <View style={styles.welcomeImageContainer}>
          <Image source={require('../assets/Welcome.png')} style={styles.welcomeImage} />
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.buttonRegister}
          onPress={() => navigation.navigate('RegisterClient')}
        >
          <Text style={styles.buttonTextRegister}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonVendedor}
          onPress={() => navigation.navigate('RegisterFreelancer')}
        >
          <Text style={styles.buttonTextVendedor}>Iniciar como vendedor</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.projectListContainer}>
        <ProjectListSB />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginTop: 40,
  },
  buttonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    marginBottom: 4,
    paddingBottom: 4,
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
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonTextVendedor: {
    color: 'white',
    fontWeight: 'bold',
  },
  projectListContainer: {
    paddingTop: 54,
    width: '100%',
  },
  image: {
    position: 'absolute',
    top: 0,
    width: "100%",
    height: 160,
  },
  welcomeContainer: {
    position: 'absolute',
    top: 100,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    paddingBottom: 4,
    flexDirection: 'column',
  },
  welcomeText: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingLeft: 65,
    paddingRight: 65,
    textAlign: 'center',
    color: 'rgba(0, 0, 0, 0.61)',
  },
  tap: {
    width: 50,
    height: 40,
    marginTop: 50,
    marginBottom: 10,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  welcomeImageContainer: {
    marginTop: 10,
    width: "80%",
    height: "100%",
  },
  welcomeImage: {
    width: '100%',
    height: '100%',
  },
});

export default HomeScreen;
