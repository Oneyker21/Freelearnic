import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button, Alert } from 'react-native';
import { db } from '../config/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';

const ProjectList = ({ route }) => {
  const { freelancerId } = route.params; // Obtener el ID del freelancer
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleSendProposal = async (projectId) => {
    const nuevaPropuesta = {
      id_freelancer: freelancerId, // Usar el ID del freelancer
      precio_propuesta: 200.00, // Cambiar según la lógica de tu aplicación
      mensaje_propuesta: "Propuesta enviada desde ProjectList", // Mensaje de propuesta
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
            onPress={() => handleSendProposal(item.id)} // Llama a la función para enviar propuesta
          />
        </View>
      )}
    />
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
