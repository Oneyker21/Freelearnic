import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet, FlatList, ActivityIndicator, Button } from 'react-native';
import { db } from '../config/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import CustomText from '../utils/CustomText';

//prueba

export const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Projects'), (querySnapshot) => {
      const projectsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data, username: data.username }; // Cambio clientID por username
      });
      setProjects(projectsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching projects: ', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <FlatList
      data={projects}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Image source={require('../assets/IconoCards.png')} style={styles.logo} />
          <CustomText style={styles.projectTitle} fontFamily="Roboto">{item.title}</CustomText>
          <CustomText style={styles.projectStatus} fontFamily="Roboto">{item.projectStatus}</CustomText>

          <View style={styles.projectTypeContainer}>
            <CustomText style={styles.projectTypeTitle} fontFamily="OpenSans">Tipo de proyecto: </CustomText>
            <CustomText style={styles.projectType} fontFamily="OpenSans">{item.projectType}</CustomText>
          </View>

          <View style={styles.projectUserContainer}>
            <CustomText style={styles.projectUserTitle} fontFamily="OpenSans">Cliente:</CustomText>
            <CustomText style={styles.projectUser} fontFamily="OpenSans">{item.username}</CustomText>
          </View>

          <View style={styles.projectDescriptionContainer}>
            <CustomText style={styles.projectDescriptionTitle} fontFamily="OpenSans">Descripción: </CustomText>
            <CustomText style={styles.projectDescription} fontFamily="OpenSans">{item.description}</CustomText>
          </View>

          <View style={styles.priceContainer}>
            <CustomText style={styles.projectPrice} fontFamily="Roboto">
              Rango precio:
            </CustomText>
            <CustomText style={styles.projectPriceDetail} fontFamily="OpenSans">
              {item.minPrice ? `\$${item.minPrice}` : 'No especificado'}
              {' - '}
              {item.maxPrice ? `\$${item.maxPrice}` : 'No especificado'}
            </CustomText>
          </View>


          <CustomText style={styles.projectFechaEntrega} fontFamily="OpenSans">
            Fecha Estimada de Entrega: {item.estimatedDeliveryDate ? item.estimatedDeliveryDate : 'No especificada'}
          </CustomText>

        </View>
      )}
    />
  );
};


const styles = StyleSheet.create({
  projectItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  projectTypeTitle: {
    fontWeight: 'bold',
    color: '#142157',
  },
  projectUserTitle: {
    fontWeight: 'bold',
    color: '#142157',
  },
  projectDescriptionTitle: {
    fontWeight: 'bold',
    color: '#142157',
  },
  logo: {
    width: 60,
    height: 60,
    position: 'absolute',
    top: 0,
    left: 5,
    zIndex: 1,
  },
  projectDescriptionContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  projectDescription: {
    fontWeight: 'bold',
  },
  projectTypeContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  projectUserContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  projectUser: {
    fontWeight: 'bold',
  },
  projectType: {
    fontWeight: 'bold',
  },
  projectTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    borderWidth: 1,
    borderRadius: 12,
    paddingTop: 30,
    paddingBottom: 30,
    borderColor: '#107ACC',
    backgroundColor: '#107ACC',
    color: 'white',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.62,
    elevation: 4,
  },

  priceContainer: {
    flexDirection: 'column',
    marginVertical: 5,
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: '#107ACC',
    borderRadius: 12,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  projectPrice: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  projectPropuestas: {
    color: '#666',
  },
  projectStatus: {
    borderWidth: 1,
    fontSize: 12,
    borderRadius: 6,
    borderColor: '#18D23A',
    backgroundColor: '#18D23A',
    right: 10,
    color: 'white',
    padding: 3,
    zIndex: 1,
    position: 'absolute',
    marginTop: 10,
    alignSelf: 'flex-end',
  },
  projectFechaEntrega: {
    color: '#142157',
    fontSize: 12,
    fontWeight: 'bold',
    alignSelf: 'flex-end',
    marginBottom: 10,
    marginRight: 10,
  },
});

export default ProjectList;
