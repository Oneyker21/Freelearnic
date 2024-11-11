import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../connection/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { getDoc,doc } from 'firebase/firestore';
import ProjectList from '../main/ProjectList'; // Asegúrate de que la ruta sea correcta

const HomeScreenSb = ({route}) => {
  const navigation = useNavigation();
  const { clientId } = route.params; // Obtener el ID del freelancer de los parámetros de la ruta
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const docRef = doc(db, 'Clients', clientId); 
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Aquí puedes manejar los datos si es necesario
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching client data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.textTitle}>Bienvenido a</Text>
        <Text style={styles.textTitle2}>Freelearnic</Text>
        <Text style={styles.textTitle3}>Explora los demás proyectos</Text>
      </View>
      <ProjectList route={{ params: { clientId } }} showProposalButton={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    height: '100%', 
    width: '100%',
    marginTop: 50,
  },
  textContainer: {
    paddingTop: 15,
    marginLeft: 10,
    fontWeight: 'regular',
    paddingBottom: 15,
  },
  textTitle: {
    fontWeight: 'regular',
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.61)',
  },
  textTitle2: {
    fontWeight: 'bold',
    fontSize: 24,
    color: 'rgba(0, 0, 0, 0.61)',
  },
  textTitle3: {
    fontWeight: 'bold',
    fontSize: 24,
    color: 'rgba(0, 0, 0, 0.61)',
  },
  buttonContainer: {
    marginBottom: 20,
  },
});

export default HomeScreenSb;