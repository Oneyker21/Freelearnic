import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button,TouchableOpacity, Image } from 'react-native';
import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../connection/firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { ScrollView } from 'react-native-gesture-handler';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';

// Función para obtener la URL de la imagen
const fetchImageUrl = async (imagePath) => {
  const storage = getStorage();
  const imageRef = ref(storage, imagePath);
  try {
    const url = await getDownloadURL(imageRef);
    return url;
  } catch (error) {
    console.error('Error al obtener la URL de la imagen:', error);
    return null;
  }
};

const UserVerification = () => {
  const [clients, setClients] = useState([]);
  const [freelancers, setFreelancers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchUsers = () => {
      let unsubscribeClients = null;
      let unsubscribeFreelancers = null;

      if (filter === 'all' || filter === 'clients') {
        const clientsQuery = query(collection(db, 'Clients'), where('verified', '==', false));
        unsubscribeClients = onSnapshot(clientsQuery, (snapshot) => {
          const clientsData = snapshot.docs.map(doc => ({
            id: doc.id,
            type: 'Client',
            ...doc.data()
          }));
          setClients(clientsData);
          if (filter === 'all') {
            setAllUsers(prev => [...clientsData, ...prev.filter(user => user.type === 'Freelancer')]);
          } else {
            setAllUsers(clientsData);
          }
        });
      }

      if (filter === 'all' || filter === 'freelancers') {
        const freelancersQuery = query(collection(db, 'Freelancers'), where('verified', '==', false));
        unsubscribeFreelancers = onSnapshot(freelancersQuery, (snapshot) => {
          const freelancersData = snapshot.docs.map(doc => ({
            id: doc.id,
            type: 'Freelancer',
            ...doc.data()
          }));
          setFreelancers(freelancersData);
          if (filter === 'all') {
            setAllUsers(prev => [...prev.filter(user => user.type === 'Client'), ...freelancersData]);
          } else {
            setAllUsers(freelancersData);
          }
        });
      }

      setLoading(false);

      return () => {
        unsubscribeClients && unsubscribeClients();
        unsubscribeFreelancers && unsubscribeFreelancers();
      };
    };

    fetchUsers();
  }, [filter]);

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


        <TouchableOpacity style={styles.button} onPress={() => setFilter('all')}> 
          <Text style={styles.buttonText}>Todos</Text>
        </TouchableOpacity>

           
           <TouchableOpacity style={styles.button} onPress={() => setFilter('clients')}> 
          <Text style={styles.buttonText}>Clientes</Text>
           </TouchableOpacity>


           <TouchableOpacity style={styles.button} onPress={() => setFilter('freelancers')}> 
          <Text style={styles.buttonText}>Freelancers</Text>
           </TouchableOpacity>
      </View>
    
      <FlatList
        data={allUsers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text  style={styles.titlename}>Cliente: {item.firstName} {item.lastName}</Text>
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.idFrontPhoto }} style={styles.userImage} />
              <Image source={{ uri: item.idBackPhoto }} style={styles.userImage} />
            </View>
            <Text style={styles.textid}>Número de ID: {item.idNum}</Text>
            <TouchableOpacity style={styles.button2} onPress={() => alert('Eliminar usuario!')}>
              <Text style={styles.buttonText2}>Eliminar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button2} onPress={() => verifyUser(item.id, item.type)}>
              <Text style={styles.buttonText2}>Verificar</Text>
            </TouchableOpacity>
          </View>
        )}
       
      />
      
    </View>
  );
};

const styles = StyleSheet.create({
  userCard: {
    padding: 10,
    margin: -10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 10,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  titlename:{
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#f0f0f0',
    marginTop: 60,
    marginBottom: 20,
  },
  imageContainer: {
    flexDirection: 'row', // Coloca las imágenes una al lado de la otra
    justifyContent: 'space-around', // Distribuye espacio uniformemente alrededor de las imágenes
    width: '100%', // Asegura que el contenedor use todo el ancho disponible
    marginTop: -20, // Espacio entre el texto y las imágenes
  },
  textid:{
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: -30,
  },
  userImage: {
    width: '45%', // Cada imagen usará el 45% del ancho del contenedor
    height: 200, // Altura fija para las imágenes
    resizeMode: 'contain', // Asegura que la imagen se escale adecuadamente dentro de las dimensiones dadas
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    height: 40,
    width: 100,
  },
  button2: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    height: 40,
    width: 320,
    marginTop: 10,
  },
  buttonText: {
  color: 'white',
  textAlign: 'center',

  },
  buttonText2: {
    color: 'white',
    textAlign: 'center',
  
    }
});

export default UserVerification;
