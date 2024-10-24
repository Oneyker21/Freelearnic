import React from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProjectListSB from './ProjectListSB'; // Asegúrate de que la ruta sea correcta

const HomeScreen = () => {
  const navigation = useNavigation();
  

  return (
    <View style={styles.container}>
      <Image source={require('../assets/superior.png')} style={styles.imageSuperior} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('TypeUser')}
        >
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonRegister}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonTextRegister}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scrollView}>
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
        <View style={styles.projectListContainer}>
          <ProjectListSB />
        </View>
      </ScrollView>
    </View>
  );
}; // Asegúrate de que este paréntesis cierre correctamente la función del componente

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    marginTop: 35,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    zIndex: 1,
  },
  buttonContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    flexDirection: 'row',
    zIndex: 1, // Asegura que los botones estén sobre otros elementos
  },
  button: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonRegister: {
    backgroundColor: null,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 6,
  },
  buttonTextRegister: {
    color: 'white',
    fontWeight: 'bold',
  },

  projectListContainer: {
    width: '100%',
    marginTop:150,
  },
  imageSuperior: {
    position: 'absolute',
    top: 0,
    width: "100%",
    height: 160,
    zIndex: 1, // Asegura que la imagen esté sobre otros elementos
  },
  welcomeContainer: {
    height: '16%',
    width: '100%',
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 4,
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
    marginBottom: 10,
  },
  logo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  welcomeImageContainer: {
    width: "100%",
    marginTop: 10,
    height: 200,
  },
  welcomeImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

});

export default HomeScreen;
