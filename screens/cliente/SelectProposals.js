import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { db } from '../../config/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';

const SelectProposals = ({ route }) => {
  const { clientId } = route.params; // Obtener el ID del cliente
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const proposalsQuery = query(collection(db, 'Proyecto'), where('id_cliente', '==', clientId));
        const querySnapshot = await getDocs(proposalsQuery);
        const proposalsData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.Propuestas) {
            proposalsData.push(...data.Propuestas);
          }
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
      // Aquí puedes actualizar el estado de la propuesta a "aceptada"
      const projectRef = doc(db, 'Proyecto', proposal.projectId); // Asegúrate de tener el ID del proyecto
      await updateDoc(projectRef, {
        Propuestas: proposal.estado_propuesta = "aceptada" // Cambiar el estado de la propuesta
      });

      Alert.alert('Éxito', 'Propuesta aceptada correctamente');
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
      <FlatList
        data={proposals}
        keyExtractor={(item) => item.id_freelancer} // Asegúrate de que cada propuesta tenga un ID único
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>Propuesta de {item.id_freelancer}</Text>
            <Text>Precio: ${item.precio_propuesta}</Text>
            <Text>Mensaje: {item.mensaje_propuesta}</Text>
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
