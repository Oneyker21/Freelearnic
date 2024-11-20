import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../connection/firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { ScrollView } from 'react-native-gesture-handler';

const UserVerification = () => {
  const [clients, setClients] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    const db = getFirestore();

    const fetchUsers = () => {
      let unsubscribeClients = null;
      let unsubscribeFreelancers = null;

      if (filter === 'all' || filter === 'clients') {
        unsubscribeClients = onSnapshot(
          query(collection(db, 'Clients'), where('verified', '==', false)),
          (snapshot) => {
            const clientsData = snapshot.docs.map(doc => ({
              id: doc.id,
              type: 'Client',
              ...doc.data()
            }));
            setClients(clientsData);
            updateAllUsers(clientsData, filter === 'clients' ? [] : freelancers);
          },
          (error) => {
            console.error('Error fetching clients:', error);
          }
        );
      }

      if (filter === 'all' || filter === 'freelancers') {
        unsubscribeFreelancers = onSnapshot(
          query(collection(db, 'Freelancers'), where('verified', '==', false)),
          (snapshot) => {
            const freelancersData = snapshot.docs.map(doc => ({
              id: doc.id,
              type: 'Freelancer',
              ...doc.data()
            }));
            setFreelancers(freelancersData);
            updateAllUsers(filter === 'freelancers' ? [] : clients, freelancersData);
          },
          (error) => {
            console.error('Error fetching freelancers:', error);
          }
        );
      }

      setLoading(false);

      return () => {
        unsubscribeClients && unsubscribeClients();
        unsubscribeFreelancers && unsubscribeFreelancers();
      };
    };

    return fetchUsers();
  }, [filter]);

  const updateAllUsers = (clients, freelancers) => {
    setAllUsers([...clients, ...freelancers]);
  };

  const verifyUser = async (userId, userType) => {
    const db = getFirestore();
    const userRef = doc(db, userType === 'Client' ? 'Clients' : 'Freelancers', userId);
    try {
      await updateDoc(userRef, {
        verified: true
      });
      alert('Usuario verificado exitosamente!');
    } catch (error) {
      console.error('Error al verificar el usuario:', error);
      alert('Error al verificar el usuario.');
    }
  };

  return (
    <View>
      <View style={styles.filterContainer}>
        <Button title="Todos" onPress={() => setFilter('all')} />
        <Button title="Clientes" onPress={() => setFilter('clients')} />
        <Button title="Freelancers" onPress={() => setFilter('freelancers')} />
      </View>
    
      <FlatList
        data={allUsers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text>{item.type}: {item.firstName} {item.lastName}</Text>
            <Text>ID Frontal: {item.idFrontPhoto}</Text>
            <Text>ID Trasera: {item.idBackPhoto}</Text>
            <Text>Número de ID: {item.idNum}</Text>
            <Button title="Eliminar" onPress={() => alert('Eliminar usuario!')} />
            <Button title="Verificar" onPress={() => verifyUser(item.id, item.type)} />
          </View>
        )}
       
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  userCard: {
    padding: 10,
    margin: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 10,
    borderBottomColor: '#eee',
    paddingBottom: 220,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginTop: 60,
    marginBottom: 20,
  }
});

export default UserVerification;
