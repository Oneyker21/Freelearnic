import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, TextInput, Dimensions, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../../connection/firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { CustomPicker } from '../../utils/inputs';

const { width, height } = Dimensions.get("window");

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

  // Función para manejar el evento de presión del botón de búsqueda
  const handleSearchPress = () => {
    filterFreelancers(searchQuery, professionFilter, freelancers);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Buscar"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearchPress}
        >
          <Ionicons name="search" size={26} color="white" />
        </TouchableOpacity>
      </View>

      {/* Filtro por profesión */}
      <CustomPicker
        style={styles.selectType}
        selectedValue={professionFilter}
        onValueChange={setProfessionFilter}
        items={professions}
        placeholder="Seleccionar profesión"
      />

      <FlatList
        contentContainerStyle={styles.listContainer}
        data={filteredFreelancers}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardBackground}></View>
            <View style={styles.imageContainer}>
               {/* <Image source={{ uri: item.imageUrl }} style={styles.freelancerImage} /> */}
              <Image source={require('../../assets/img/Freelearnic.png')} style={styles.freelancerImage} />
            </View>
            <Text style={[styles.userStatus, { backgroundColor: item.userStatus ? '#18D23A' : '#FF0000' }]}>
              {item.userStatus ? 'Disponible' : 'No Disponible' }
            </Text>
            <View style={styles.dataContainer}>
              <View style={styles.nameAndProfessionContainer}>
                <Text style={styles.freelancerName}>{item.firstName} {item.lastName}</Text>
                <Text style={styles.freelancerProfession}>{item.profession}</Text>
              </View>
              <View style={styles.descriptionContainer}>
                <Text style={styles.freelancerDescription}>{item.description}</Text>
              </View>
              <View style={styles.ratingContainer}>
                <Text style={styles.stars}>⭐</Text>
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16, 
    backgroundColor: '#f4f4f4',
    marginTop: 30,
  },
  listContainer: {
    paddingBottom: 100,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: width * 0.010,
    marginTop: -20,
  },
  searchBar: {
    flex: 1,
    height: height * 0.05,
    borderColor: "#ccc",
    backgroundColor: "#D9D9D9",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: width * 0.025,
    marginLeft: width * 0.01,
  },
  searchButton: {
    height: height * 0.049,
    backgroundColor: "#007AFF",
    paddingVertical: height * 0.009,
    paddingHorizontal: width * 0.03,
    borderRadius: 8,
    marginLeft: width * 0.02,
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
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'relative',
    overflow: 'hidden',
  },
  cardBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#15297C',
  },
  dataContainer: {
    top: -10,
    marginRight: -20,
    marginBottom: -20,
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 10,
    left: -10,
  },
  imageContainer: {
    top: -10,
    left: -10,
    marginBottom: -20,
    width: '35%',
    height: 200,
  },
  freelancerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: '#fff',
    borderColor: '#ccc',
  },

  nameAndProfessionContainer: {
    position: 'absolute',
    top: 3,
    left: 0,
    right: 0,
    padding: 10,
  },
  freelancerName: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#fff',
  },
  freelancerProfession: {
    textAlign: 'center',
    fontSize: 16,
    color: '#fff',
  },
  descriptionContainer: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    bottom: 30,
    padding: 10,
  },
  ratingContainer: {
    position: 'absolute',
    left: 10,
    right: 0,
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    color: '#FFD700',
    marginRight: 5,
  },
  ratingText: {
    fontSize: 14,
    color: '#666',
  },
  freelancerDescription: {
    textAlign: 'center',
    color: '#000',
  },
  userStatus: {
    position: 'absolute',
    fontSize: 8,
    top: 2,
    right: 2,
    color: '#ffff',
    backgroundColor: '#007AFF',
    padding: 3,
    borderRadius: 9,
  },

  freelancerLocation: {
    color: '#666',
  },
  freelancerVerified: {
    color: '#666',
  },
});

export default SearchFreelancers;
