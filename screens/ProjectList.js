import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button, Alert } from 'react-native';
import { db } from '../config/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import ProposalModal from '../screens/freelancer/ProposalModal'; // Asegúrate de que la ruta sea correcta

const ProjectList = ({ route }) => {
  const { freelancerId } = route.params; // Obtener el ID del freelancer
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);

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

  const handleSendProposal = async (projectId, proposalData) => {
    const nuevaPropuesta = {
      id_freelancer: freelancerId,
      precio_propuesta: proposalData.precio_propuesta,
      mensaje_propuesta: proposalData.mensaje_propuesta,
      estado_propuesta: "pendiente",
      fecha_propuesta: new Date().toISOString()
    };

    try {
      const proyectoRef = doc(db, 'Proyecto', projectId);
      const proyectoSnap = await getDoc(proyectoRef);

      if (proyectoSnap.exists()) {
        const propuestasPrevias = proyectoSnap.data().Propuestas || [];
        await updateDoc(proyectoRef, {
          Propuestas: [...propuestasPrevias, nuevaPropuesta]
        });
        Alert.alert('Éxito', 'Propuesta enviada correctamente');
      } else {
        console.log('El proyecto no existe');
      }
    } catch (error) {
      console.error('Error al enviar la propuesta: ', error);
      Alert.alert('Error', 'No se pudo enviar la propuesta: ' + error.message);
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
            <Button
              title="Enviar Propuesta"
              onPress={() => {
                setSelectedProjectId(item.id);
                setModalVisible(true);
              }} // Abre el modal
            />
          </View>
        )}
      />
      <ProposalModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={(proposalData) => {
          handleSendProposal(selectedProjectId, proposalData); // Asegúrate de que proposalData tenga las propiedades correctas
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
});

export default ProjectList;
