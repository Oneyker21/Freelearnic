import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button } from 'react-native';
import { db } from '../config/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { collection, getDocs } from 'firebase/firestore';

//prueba

const ProjectList = () => {
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
              Rango precio: 
             
              <Text>
                {item.precio_minimo ? `\$${item.precio_minimo}` : 'No especificado'}
                {' - '}
                {item.precio_maximo ? `\$${item.precio_maximo}` : 'No especificado'}
              </Text>
            </Text>
          </View>
          
          <Text style={styles.projectDescription}>{item.descripcion_proyecto}</Text>
          
          {/* Manejo de propuestas para evitar valores null o undefined */}
          <Text style={styles.projectPropuestas}>
            Propuestas: {item.propuestas ? item.propuestas : 0}
          </Text>
          
          {/* Manejo de las fechas, asegurando que son válidas */}
          <Text style={styles.projectFechaInicio}>
            Fecha de Inicio: {item.fecha_inicio ? item.fecha_inicio : 'No especificada'}
          </Text>
          <Text style={styles.projectFechaEntrega}>
            Fecha Estimada de Entrega: {item.fecha_estimada_entrega ? item.fecha_estimada_entrega : 'No especificada'}
          </Text>
          
          {/* Botón para enviar propuesta */}
          <Button
            title="Enviar Propuesta"
            onPress={() => handleSendProposal(item.id)} // Llama a la función para enviar propuesta
          />
        </View>
      )}
    />
  );
};

// Función para manejar el envío de la propuesta
const handleSendProposal = (projectId) => {
  // Lógica para enviar la propuesta
  console.log(`Propuesta enviada para el proyecto: ${projectId}`);
};

const styles = StyleSheet.create({
  projectItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  projectTitle: {
    fontWeight: 'bold',
    fontSize: 16,
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
  projectDescription: {
    marginVertical: 5,
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
