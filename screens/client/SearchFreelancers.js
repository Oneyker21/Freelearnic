import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import { db } from '../../connection/firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { CustomPicker } from '../../utils/inputs';

const SearchFreelancers = () => {
    const [freelancers, setFreelancers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [professionFilter, setProfessionFilter] = useState('');
    const [filteredFreelancers, setFilteredFreelancers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
  
    // Opciones de profesiones para el filtro
    const professions = [
      { label: 'Todos', value: '' },
      { label: 'Ingeniera en sistemas', value: 'Ingeniera en sistemas' },
      { label: 'Programador', value: 'Programador' },
      { label: 'Diseñador gráfico', value: 'Diseñador gráfico' },
      // Agrega otras profesiones según tu base de datos
    ];
  
    useEffect(() => {
      const unsubscribe = onSnapshot(collection(db, 'Freelancers'), (querySnapshot) => {
        const freelancersData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFreelancers(freelancersData);
        filterFreelancers(searchQuery, professionFilter, freelancersData);
        setLoading(false);
      }, (error) => {
        console.error('Error fetching freelancers: ', error);
        setLoading(false);
      });
  
      return () => unsubscribe();
    }, [searchQuery, professionFilter]);
  
    // Filtrar freelancers por búsqueda y profesión
    const filterFreelancers = (text, profession, freelancersData) => {
      let filtered = freelancersData;
  
      // Filtrar por profesión
      if (profession !== '') {
        filtered = filtered.filter(freelancer => freelancer.profession === profession);
      }
  
      // Filtrar por nombre de usuario
      if (text !== '') {
        filtered = filtered.filter(freelancer => freelancer.username.toLowerCase().includes(text.toLowerCase()));
      }
  
      setFilteredFreelancers(filtered);
    };
  
    // Filtrar freelancers por nombre de usuario en tiempo real
    const handleSearch = (text) => {
      setSearchQuery(text);
      if (text === '') {
        setFilteredFreelancers(freelancers);
      } else {
        const filtered = freelancers.filter(freelancer => freelancer.username.toLowerCase().includes(text.toLowerCase()));
        setFilteredFreelancers(filtered);
      }
    };
  
    if (loading) {
      return <ActivityIndicator size="large" color="#007AFF" />;
    }
  
    return (
        <View style={styles.container}>
          {/* Barra de búsqueda */}
          <TextInput
            style={styles.searchBar}
            placeholder="Buscar por nombre de usuario"
            value={searchQuery}
            onChangeText={handleSearch}
          />
      
          {/* Filtro por profesión */}
          <CustomPicker
            style={styles.selectType}
            selectedValue={professionFilter}
            onValueChange={setProfessionFilter}
            items={professions}
            placeholder="Seleccionar profesión"
          />
      
          <FlatList
            contentContainerStyle={styles.listContainer} // Estilo adicional para el contenido de la lista
            data={filteredFreelancers}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.freelancerName}>{item.firstName} {item.lastName}</Text>
                <Text style={styles.freelancerUsername}>Usuario: {item.username}</Text>
                <Text style={styles.freelancerProfession}>Profesión: {item.profession}</Text>
                <Text style={styles.freelancerLocation}>Ciudad: {item.city}, {item.state}</Text>
                <Text style={styles.freelancerVerified}>Verificado: {item.verified ? 'Sí' : 'No'}</Text>
              </View>
            )}
          />
        </View>
      );      
  };
  
  const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16, // Margen alrededor del contenedor principal
        backgroundColor: '#f4f4f4',
        marginTop: 30,
      },
    searchBar: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      paddingLeft: 10,
      margin: 10,
    },
    selectType: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 8,
      paddingLeft: 10,
      margin: 10,
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
    freelancerName: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    freelancerUsername: {
      color: '#666',
    },
    freelancerProfession: {
      color: '#666',
    },
    freelancerLocation: {
      color: '#666',
    },
    freelancerVerified: {
      color: '#666',
    },
  });

export default SearchFreelancers;
