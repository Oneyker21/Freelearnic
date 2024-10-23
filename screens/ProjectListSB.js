import React, { useEffect, useState } from 'react';
import { View, Text,StyleSheet, FlatList, ActivityIndicator, Button } from 'react-native';
import { db } from '../config/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { collection, getDocs,onSnapshot } from 'firebase/firestore';
import CustomText from '../utils/CustomText';

//prueba

export const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Projects'), (querySnapshot) => {
      const projectsData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, ...data, clientID: data.username }; // Cambio clientID por username
      });
      setProjects(projectsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching projects: ', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  return (
    <FlatList
      data={projects}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <CustomText style={styles.projectTitle} fontFamily="Roboto">{item.title}</CustomText>
          <CustomText style={styles.projectStatus} fontFamily="Roboto">{item.projectStatus}</CustomText>
          <CustomText style={styles.projectType} fontFamily="OpenSans">{item.projectType}</CustomText>
          <CustomText style={styles.projectUser} fontFamily="OpenSans">{item.username}</CustomText> // Cambio clientID por username
          <View style={styles.priceContainer}>
            <CustomText style={styles.projectPrice} fontFamily="Roboto">
              Rango precio: 
              <CustomText fontFamily="OpenSans">
                {item.minPrice ? `\$${item.minPrice}` : 'No especificado'}
                {' - '}
                {item.maxPrice ? `\$${item.maxPrice}` : 'No especificado'}
              </CustomText>
            </CustomText>
          </View>
          
          <CustomText style={styles.projectDescription} fontFamily="OpenSans">{item.description}</CustomText>
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
  projectTitle: {
    fontWeight: 'bold',
    fontSize: 15,
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    borderColor: '#107ACC',
    backgroundColor: '#107ACC',
    color: 'white',
    textAlign: 'center',
    margin:0
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.62,
    elevation: 4,
  },
  projectDescription: {
    marginVertical: 5,
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  projectPrice: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  projectPropuestas: {
    color: '#666',
  },
  projectFechaInicio: {
    color: '#666',
  },
  projectStatus: {
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#00FF00',
    backgroundColor: '#00FF00',
    color: 'white',
    padding: 3,
    alignSelf: 'flex-start',
  },
  projectFechaEntrega: {
    color: '#666',
  },
});

export default ProjectList;
