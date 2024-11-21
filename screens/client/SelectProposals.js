import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { db } from '../../connection/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { collection, getDocs, query, where, updateDoc, doc, writeBatch,onSnapshot,getDoc } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SelectProposals = ({ route }) => {
  const { clientId } = route.params; // Obtener el ID del cliente
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(collection(db, "Proposals"), where("clientID", "==", clientId)),
      async (querySnapshot) => {
        const proposalsData = [];
        for (const docSnapshot of querySnapshot.docs) {
          const proposal = {
            id: docSnapshot.id,
            ...docSnapshot.data(),
          };
          console.log("Procesando propuesta con ID:", proposal.id);
          console.log("Freelancer ID de la propuesta:", proposal.freelancerID);
  
          // Obtener datos del freelancer
          if (proposal.freelancerID) {
            const freelancerRef = doc(db, "Freelancers", proposal.freelancerID);
            const freelancerDoc = await getDoc(freelancerRef);
            if (freelancerDoc.exists()) {
              const freelancerData = freelancerDoc.data();
              proposal.freelancerName =
                freelancerData.firstName + " " + freelancerData.lastName;
              console.log("Nombre del freelancer encontrado:", proposal.freelancerName);
            } else {
              proposal.freelancerName = "Freelancer desconocido";
              console.log("No se encontró el documento para el freelancerID:", proposal.freelancerID);
            }
          } else {
            proposal.freelancerName = "Freelancer no especificado";
          }
  
          proposalsData.push(proposal);
        }
        setProposals(proposalsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching proposals in real-time:", error);
        setLoading(false);
      }
    );
  
    return () => unsubscribe();
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
            {`Propuesta de ${item.freelancerName || 'Desconocido'}`}
          </Text>
          <Text>{`Precio mínimo: $${item.proposedPrice || 'N/A'}`}</Text>
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
    backgroundColor: '#107acc',
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
