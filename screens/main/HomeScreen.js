import React from 'react';
import { Image, View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProjectListSB from './ProjectListSB'; // Asegúrate de que la ruta sea correcta

const HomeScreen = () => {
  const navigation = useNavigation();
  // Lista de datos vacía para simular la estructura de FlatList
  const data = [];

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/img/superior.png')} style={styles.imageSuperior} />
      <View style={styles.buttonContainer}>
        <Image source={require('../../assets/img/IconoCards.png')} style={styles.LogoIcon} />
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
      <FlatList
        data={data}
        style={styles.flatList}
        renderItem={null}
        keyExtractor={() => 'dummy'} // Llave única para evitar errores
        ListHeaderComponent={
          <View style={styles.welcomeContainer}>
            <View style={styles.tap}>
              <Image source={require('../../assets/img/tap.png')} style={styles.logo} />
            </View>
            <Text style={styles.welcomeText}>
              ¡En Freelearnic, tu próximo proyecto o freelancer está a un clic de distancia!
            </Text>
            <View style={styles.welcomeImageContainer}>
              <Image source={require('../../assets/img/Welcome.png')} style={styles.welcomeImage} />
            </View>
          </View>
        }
        ListFooterComponent={
          <View style={styles.projectListContainer}>
            <ProjectListSB />
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 35,
    width: '100%',
  },
  flatList: {
    width: '100%',
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
    zIndex: 1,
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
    paddingLeft: 10,
    paddingRight: 10,
  },
  imageSuperior: {
    position: 'absolute',
    top: 0,
    width: "100%",
    height: 170,
    zIndex: 1,
  },
  welcomeContainer: {
    height: '16%',
    width: '100%',
    alignItems: 'center',
    marginTop: 100,
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

  LogoIcon: {
    position: 'absolute',
    top: 4,
    right: 325,
    width: 60,
    height: 50,
  },
});

export default HomeScreen;
