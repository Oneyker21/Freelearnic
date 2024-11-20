import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from '../../connection/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';

const UserVerification = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'clients', 'freelancers', 'all'

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      let usersData = [];
      if (filter === 'all' || filter === 'clients') {
        const clientsQuery = query(collection(db, 'Clients'));
        const clientsSnapshot = await getDocs(clientsQuery);
        clientsSnapshot.forEach(doc => {
          const userData = { id: doc.id, type: 'Client', ...doc.data() };
          if (userData.idFrontPhoto && userData.idBackPhoto && userData.idNum) {
            usersData.push(userData);
          }
        });
      }
      if (filter === 'all' || filter === 'freelancers') {
        const freelancersQuery = query(collection(db, 'Freelancers'));
        const freelancersSnapshot = await getDocs(freelancersQuery);
        freelancersSnapshot.forEach(doc => {
          const userData = { id: doc.id, type: 'Freelancer', ...doc.data() };
          if (userData.idFrontPhoto && userData.idBackPhoto && userData.idNum) {
            usersData.push(userData);
          }
        });
      }
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setFilter('all')} style={styles.filterButton}>
        <Text>Todos</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setFilter('clients')} style={styles.filterButton}>
        <Text>Clientes</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setFilter('freelancers')} style={styles.filterButton}>
        <Text>Freelancers</Text>
      </TouchableOpacity>
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text>{item.type}: {item.firstName} {item.lastName}</Text>
            <Text>ID Frontal: {item.idFrontPhoto}</Text>
            <Text>ID Trasera: {item.idBackPhoto}</Text>
            <Text>Número de ID: {item.idNum}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  filterButton: {
    padding: 10,
    margin: 5,
    backgroundColor: '#ddd',
  },
  userCard: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#eee',
  }
});

export default UserVerification;
