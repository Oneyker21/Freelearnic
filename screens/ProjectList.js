import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert, Modal, Button,TextInput } from 'react-native';
import { db } from '../config/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { collection, addDoc, onSnapshot } from 'firebase/firestore';
import ProposalModal from '../screens/freelancer/ProposalModal'; // Asegúrate de que la ruta sea correcta
import { Picker } from '@react-native-picker/picker'; // Importación correcta

const ProjectList = ({ route, showProposalButton }) => {
  const { freelancerId } = route.params;
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(''); // Inicializa con un valor vacío
  const [priceFilter, setPriceFilter] = useState({ min: 0, max: 1000 }); // Rango de precios inicial
  const [filteredProjects, setFilteredProjects] = useState([]);

  // Definir las categorías preestablecidas
  const categories = [
    { label: 'Todos', value: '' },
    { label: 'Desarrollo de Aplicaciones', value: 'desarrollo_aplicaciones' },
    { label: 'Diseño Gráfico', value: 'diseno_grafico' },
    { label: 'Marketing Digital', value: 'marketing_digital' },
    { label: 'Escritura', value: 'escritura' },
  ];

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Proyecto'), (querySnapshot) => {
      const projectsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProjects(projectsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching projects: ', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const filtered = projects.filter(project => {
      // Filtrar por categoría
      const categoryMatch = categoryFilter ? project.tipo_proyecto === categoryFilter : true;
      // Filtrar por rango de precios
      const priceMatch = project.precio_minimo >= priceFilter.min && project.precio_maximo <= priceFilter.max;
      return categoryMatch && priceMatch;
    });
    setFilteredProjects(filtered);
  }, [categoryFilter, priceFilter, projects]);

  const enviarPropuesta = async (projectId, proposalData) => {
    try {
      const propuesta = {
        id_freelancer: freelancerId,
        id_proyecto: projectId,
        precio_propuesta: proposalData.precio_propuesta,
        mensaje_propuesta: proposalData.mensaje_propuesta,
        estado_propuesta: 'pendiente',
        fecha_propuesta: new Date().toISOString(),
        id_cliente: proposalData.id_cliente
      };
      await addDoc(collection(db, 'Propuestas'), propuesta);
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
      <Button title="Filtrar Proyectos" onPress={() => setFilterModalVisible(true)} />
      
      <FlatList
        data={filteredProjects}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.projectTitle}>{item.titulo}</Text>
            <Text style={styles.projectTipo}>{item.tipo_proyecto}</Text>
            <Text style={styles.projectUser}>{item.id_cliente}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.projectPrecio}>
                Rango precio: {item.precio_minimo ? `\$${item.precio_minimo}` : 'No especificado'} - {item.precio_maximo ? `\$${item.precio_maximo}` : 'No especificado'}
              </Text>
            </View>
            <Text style={styles.projectDescription}>{item.descripcion_proyecto}</Text>
            <Text style={styles.projectPropuestas}>
              Propuestas: {item.Propuestas ? item.Propuestas.length : 0}
            </Text>
            <Text style={styles.projectFechaInicio}>
              Fecha de Inicio: {item.fecha_inicio ? item.fecha_inicio : 'No especificada'}
            </Text>
            <Text style={styles.projectFechaEntrega}>
              Fecha Estimada de Entrega: {item.fecha_estimada_entrega ? item.fecha_estimada_entrega : 'No especificada'}
            </Text>
            {showProposalButton && (
              <TouchableOpacity onPress={() => {
                setSelectedProjectId(item.id);
                setSelectedClientId(item.id_cliente);
                setModalVisible(true);
              }} style={styles.button}>
                <Text style={styles.buttonText}>Enviar Propuesta</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {/* Modal de Filtrado */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Filtrar Proyectos</Text>
          
          <Text>Seleccionar Tipo de Proyecto:</Text>
          <Picker
            selectedValue={categoryFilter}
            style={styles.picker}
            onValueChange={(itemValue) => setCategoryFilter(itemValue)}
          >
            {categories.map((category) => (
              <Picker.Item key={category.value} label={category.label} value={category.value} />
            ))}
          </Picker>

          <Text>Rango de Precios:</Text>
          <View style={styles.priceRangeContainer}>
            <Text>Precio Mínimo:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(priceFilter.min)}
              onChangeText={(text) => setPriceFilter({ ...priceFilter, min: Number(text) })}
            />
            <Text>Precio Máximo:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={String(priceFilter.max)}
              onChangeText={(text) => setPriceFilter({ ...priceFilter, max: Number(text) })}
            />
          </View>

          <Button title="Aplicar Filtros" onPress={() => setFilterModalVisible(false)} />
          <Button title="Cerrar" onPress={() => setFilterModalVisible(false)} />
        </View>
      </Modal>

      <ProposalModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={(proposalData) => {
          proposalData.id_cliente = selectedClientId;
          enviarPropuesta(selectedProjectId, proposalData);
          setModalVisible(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  priceRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '45%',
  },
});

export default ProjectList;