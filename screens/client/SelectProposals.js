import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { db } from '../../config/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { collection, getDocs, query, where, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SelectProposals = ({ route }) => {
  const { clientId } = route.params; // Obtener el ID del cliente
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        // Obtener propuestas directamente de la colección 'Propuestas'
        const proposalsQuery = query(collection(db, 'Proposals'), where('clientID', '==', clientId));
        const querySnapshot = await getDocs(proposalsQuery);
        const proposalsData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          proposalsData.push({ id: doc.id, ...data }); // Agregar el ID del documento
        });

        setProposals(proposalsData);
      } catch (error) {
        console.error('Error fetching proposals: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProposals();
  }, [clientId]);

  const acceptProposal = async (proposal) => {
    try {
      const allProposalsQuery = query(collection(db, 'Proposals'), where('projectID', '==', proposal.projectID));
      const allProposalsSnapshot = await getDocs(allProposalsQuery);
      const batch = writeBatch(db);

      allProposalsSnapshot.forEach((docSnapshot) => {
        const proposalRef = doc(db, 'Proposals', docSnapshot.id); // Corrección aquí
        if (docSnapshot.id === proposal.id) {
          batch.update(proposalRef, {
            proposalStatus: "aceptada",
            clientID: proposal.clientID
          });
        } else {
          batch.update(proposalRef, {
            proposalStatus: "rechazada"
          });
        }
      });

      await batch.commit();

      Alert.alert('Éxito', 'Propuesta aceptada correctamente y las demás han sido rechazadas');
      setProposals(prevProposals => 
        prevProposals.map(p => 
          p.id === proposal.id ? { ...p, proposalStatus: "aceptada" } : { ...p, proposalStatus: "rechazada" }
        )
      );
    } catch (error) {
      console.error('Error al aceptar la propuesta: ', error);
      Alert.alert('Error', 'No se pudo aceptar la propuesta: ' + error.message);
    }
  };

  if (loading) {
    return <Text>Cargando...</Text>;
  }

  return (
    <View style={styles.container}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={30} color="#15297C" />
          </TouchableOpacity>
    <FlatList
      data={proposals}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>
            {`Propuesta de ${item.freelancerID || 'Desconocido'}`}
          </Text>
          <Text>{`Precion minimo: $${item.proposedPrice || 'N/A'}`}</Text>
          <Text>{`Mensaje: ${item.proposalMessage || 'Sin mensaje'}`}</Text>
          <Text>{`Estado: ${item.proposalStatus || 'Desconocido'}`}</Text>
          <TouchableOpacity onPress={() => acceptProposal(item)} style={styles.button}>
            <Text style={styles.buttonText}>Aceptar Propuesta</Text>
          </TouchableOpacity>
        </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
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
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
});

export default SelectProposals;
