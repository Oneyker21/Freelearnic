import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../config/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { getDoc,doc } from 'firebase/firestore';
import ProjectList from '../ProjectList'; // Asegúrate de que la ruta sea correcta

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
      <ProjectList route={{ params: { clientId } }} showProposalButton={false} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('SelectProposal', { clientId })} 
        >
          <Text style={styles.buttonText}>Propuestas</Text>
        </TouchableOpacity>
      </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5, // Espaciado entre botones
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default HomeScreenSb;