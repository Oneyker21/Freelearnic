import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Button } from 'react-native';
import { db } from '../config/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { collection, getDocs } from 'firebase/firestore';
import CustomText from '../utils/CustomText';

//prueba

export const ProjectList = () => {
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
          <CustomText style={styles.projectTitle} fontFamily="Roboto">{item.titulo}</CustomText>
          <CustomText style={styles.projectTipo} fontFamily="OpenSans">{item.tipo_proyecto}</CustomText>
          <CustomText style={styles.projectUser} fontFamily="OpenSans">{item.id_cliente}</CustomText> 
          <View style={styles.priceContainer}>
            <CustomText style={styles.projectPrecio} fontFamily="Roboto">
              Rango precio: 
              <CustomText fontFamily="OpenSans">
                {item.precio_minimo ? `\$${item.precio_minimo}` : 'No especificado'}
                {' - '}
                {item.precio_maximo ? `\$${item.precio_maximo}` : 'No especificado'}
              </CustomText>
            </CustomText>
          </View>
          
          <CustomText style={styles.projectDescription} fontFamily="OpenSans">{item.descripcion_proyecto}</CustomText>
          
          {/* Manejo de propuestas para evitar valores null o undefined */}
          <Text style={styles.projectPropuestas}>
            Propuestas: {item.propuestas ? item.propuestas : 0}
          </Text>
          <Text style={styles.projectPropuestas}>
            Propuestas: {item.propuestas ? item.propuestas : 0}
          </Text>
          
          <CustomText style={styles.projectFechaInicio} fontFamily="OpenSans">
            Fecha de Inicio: {item.fecha_inicio ? item.fecha_inicio : 'No especificada'}
          </CustomText>
          <CustomText style={styles.projectFechaEntrega} fontFamily="OpenSans">
            Fecha Estimada de Entrega: {item.fecha_estimada_entrega ? item.fecha_estimada_entrega : 'No especificada'}
          </CustomText>
          
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
    fontSize: 15,
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
