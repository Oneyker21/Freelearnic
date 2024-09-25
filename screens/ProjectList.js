import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button, Alert, TouchableOpacity } from 'react-native';
import { db } from '../config/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { collection, getDocs, doc, getDoc, updateDoc,addDoc} from 'firebase/firestore';
import ProposalModal from '../screens/freelancer/ProposalModal'; // Asegúrate de que la ruta sea correcta

const ProjectList = ({ route }) => {
  const { freelancerId } = route.params; // Obtener el ID del freelancer
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'Proyecto'));
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

  const enviarPropuesta = async (projectId, proposalData) => {
    try {
      const propuesta = {
        id_freelancer: freelancerId,
        id_proyecto: projectId,
        precio_propuesta: proposalData.precio_propuesta,
        mensaje_propuesta: proposalData.mensaje_propuesta,
        estado_propuesta: 'pendiente',
        fecha_propuesta: new Date().toISOString(),
        id_cliente: proposalData.id_cliente // Asegúrate de incluir el id_cliente aquí
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
      <FlatList
        data={projects}
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
            <TouchableOpacity onPress={() => {
              setSelectedProjectId(item.id);
              setSelectedClientId(item.id_cliente); // Establece el id_cliente
              setModalVisible(true);
            }} style={styles.button}>
              <Text style={styles.buttonText}>Enviar Propuesta</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <ProposalModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={(proposalData) => {
          // Agrega el id_cliente a proposalData antes de enviarlo
          proposalData.id_cliente = selectedClientId; // Incluye el id_cliente
          enviarPropuesta(selectedProjectId, proposalData); // Envía la propuesta
          setModalVisible(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
