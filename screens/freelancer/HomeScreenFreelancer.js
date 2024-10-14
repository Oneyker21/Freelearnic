import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator,TouchableOpacity,Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import ProjectList from '../ProjectList'; // Asegúrate de que la ruta sea correcta
import { db } from '../../config/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { doc, getDoc } from 'firebase/firestore';

const HomeScreenFreelancer = ({ route }) => {
  const { freelancerId } = route.params; // Obtener el ID del freelancer de los parámetros de la ruta
  console.log('Freelancer ID en HomeScreenFreelancer:', freelancerId); 
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchFreelancerData = async () => {
      try {
        const docRef = doc(db, 'Freelancer', freelancerId); // Cambia 'Freelancers' por el nombre de tu colección
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Aquí puedes manejar los datos si es necesario
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching freelancer data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancerData();
  }, [freelancerId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  return (
    
    <View style={styles.container}>
      <ProjectList route={{ params: { freelancerId } }} showProposalButton={true} />

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Profile Freelancer', { freelancerId })} // Asegúrate de pasar freelancerId aquí
        >
          <Text style={styles.buttonText}>Perfil</Text>
        </TouchableOpacity>
      
  
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

export default HomeScreenFreelancer;
