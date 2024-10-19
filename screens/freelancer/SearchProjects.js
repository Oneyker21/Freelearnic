import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, TextInput, Alert } from 'react-native';
import { db } from '../config/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { collection, getDocs} from 'firebase/firestore';
import ProposalModal from '../screens/freelancer/ProposalModal'; // Asegúrate de que la ruta sea correcta

const SearchProjects = ({showProposalButton}) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // Estado para la búsqueda

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Projects'));
        const projectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

 // Filtrar proyectos según la búsqueda
  const filteredProjects = projects.filter(project =>
    project.titulo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar proyecto..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredProjects}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.projectTitle}>{item.title}</Text>
            <Text style={styles.projectTipo}>{item.projectType}</Text>
            <Text style={styles.projectUser}>{item.clientID}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.projectPrecio}>
                Rango precio: {item.minPrice ? `\$${item.minPrice}` : 'No especificado'} - {item.maxPrice ? `\$${item.maxPrice}` : 'No especificado'}
              </Text>
            </View>
            <Text style={styles.projectDescription}>{item.description}</Text>
            <Text style={styles.projectPropuestas}>
              Propuestas: {item.Proposal ? item.Propuestas.length : 0}
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
                setSelectedClientId(item.clientID); // Establece el id_cliente
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
          // Agrega el id_cliente a proposalData antes de enviarlo
          proposalData.clientID = selectedClientId; // Incluye el id_cliente
          enviarPropuesta(selectedProjectId, proposalData); // Envía la propuesta
          setModalVisible(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
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

export default SearchProjects;