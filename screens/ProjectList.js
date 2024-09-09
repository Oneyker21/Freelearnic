import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { db } from '../config/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { collection, getDocs } from 'firebase/firestore';

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
        <View style={styles.projectItem}>
          <Text style={styles.projectTitle}>{item.titulo}</Text>
          <Text>{item.descripcion_proyecto}</Text>
          <Text>Precio: ${item.precio}</Text>
        </View>
      )}
    />
  );
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
});

export default ProjectList;