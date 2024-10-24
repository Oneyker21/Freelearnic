import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert, TextInput } from 'react-native';
import { db } from '../config/firebaseConfig';
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import ProposalModal from '../screens/freelancer/ProposalModal';
import { CustomPicker } from '../utils/inputs';

const ProjectList = ({ route, showProposalButton }) => {
  const { freelancerId } = route.params;

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Definir las categorías preestablecidas
  const projectType = [
    { label: 'Todos', value: '' },
    { label: 'Desarrollo de Software', value: 'Desarrollo de Software' },
    { label: 'Programación', value: 'Programación' },
    { label: 'Diseño Gráfico', value: 'Diseño Gráfico' },
    { label: 'Marketing Digital', value: 'Marketing Digital' },
    { label: 'Base de datos', value: 'Base de datos' },
    { label: 'Desarrollo Web', value: 'Desarrollo Web' },
  ];

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Projects'), (querySnapshot) => {
      const projectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projectsData);
      filterProjects(searchQuery, categoryFilter, projectsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching projects: ', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [searchQuery, categoryFilter]);

  // Filtrar proyectos por búsqueda y categoría
  const filterProjects = (text, type, projectsData) => {
    let filtered = projectsData;

    // Filtrar por categoría
    if (type !== '') {
      filtered = filtered.filter(project => project.projectType === type);
    }

    // Filtrar por búsqueda de texto
    if (text !== '') {
      filtered = filtered.filter(project => project.title.toLowerCase().includes(text.toLowerCase()));
    }

    setFilteredProjects(filtered);
  };

  // Filtrar proyectos por título en tiempo real
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text === '') {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(project => project.title.toLowerCase().includes(text.toLowerCase()));
      setFilteredProjects(filtered);
    }
  };

  const enviarPropuesta = async (projectId, proposalData) => {
    try {
      const Proposal = {
        freelancerID: freelancerId,
        projectID: projectId,
        proposedPrice: proposalData.proposedPrice,
        proposalMessage: proposalData.proposalMessage,
        proposalStatus: 'pendiente',
        proposalDate: new Date().toISOString(),
        clientID: proposalData.clientID
      };
      await addDoc(collection(db, 'Proposals'), Proposal);
      Alert.alert('Propuesta enviada');
    } catch (error) {
      console.error("Error al enviar la propuesta: ", error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Barra de búsqueda */}
      <TextInput
        style={styles.searchBar}
        placeholder="Buscar por título"
        value={searchQuery}
        onChangeText={handleSearch}
      />
      
      {/* Filtro por categoría */}
      <CustomPicker
        selectedValue={categoryFilter}
        onValueChange={setCategoryFilter}
        items={projectType}
        placeholder="Seleccionar categoría"
      />

      <FlatList
        data={filteredProjects}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.projectTitle}>{item.title}</Text>
            <Text style={styles.projectTipo}>{item.projectType}</Text>
            <Text style={styles.projectTipo}>{item.projectStatus}</Text>
            <Text style={styles.projectUser}>{item.clientID}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.projectPrecio}>
                Rango precio: {item.minPrice ? `\$${item.minPrice}` : 'No especificado'} - {item.maxPrice ? `\$${item.maxPrice}` : 'No especificado'}
              </Text>
            </View>
            <Text style={styles.projectDescription}>{item.description}</Text>
            <Text style={styles.projectPropuestas}>
              Propuestas: {item.Propuestas ? item.Propuestas.length : 0}
            </Text>
            <Text style={styles.projectFechaInicio}>
              Fecha de Inicio: {item.startDate ? item.startDate : 'No especificada'}
            </Text>
            <Text style={styles.projectFechaEntrega}>
              Fecha Estimada de Entrega: {item.estimatedDeliveryDate ? item.estimatedDeliveryDate : 'No especificada'}
            </Text>
            {showProposalButton && (
              <TouchableOpacity onPress={() => {
                setSelectedProjectId(item.id);
                setSelectedClientId(item.clientID);
                setModalVisible(true);
              }} style={styles.button}>
                <Text style={styles.buttonText}>Enviar Propuesta</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
      <ProposalModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={(proposalData) => {
          proposalData.clientID = selectedClientId;
          enviarPropuesta(selectedProjectId, proposalData);
          setModalVisible(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    margin: 10,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
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
  projectTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  projectTipo: {
    color: '#666',
  },
  projectUser: {
    color: '#666',
  },
  priceContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  projectPrecio: {
    fontWeight: 'bold',
    color: '#007AFF',
  },
  projectDescription: {
    marginVertical: 5,
    color: '#666',
  },
  projectPropuestas: {
    color: '#666',
  },
  projectFechaInicio: {
    color: '#666',
  },
  projectFechaEntrega: {
    color: '#666',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProjectList;
