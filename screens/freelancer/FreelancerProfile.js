import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { db } from '../../config/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { doc, getDoc } from 'firebase/firestore';

const FreelancerProfile = ({ route }) => {
  const { freelancerId } = route.params; // Asegúrate de obtener el freelancerId de los parámetros de la ruta
  const [freelancerData, setFreelancerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFreelancerData = async () => {
      try {
        const docRef = doc(db, 'Freelancer', freelancerId); // Cambia 'Freelancer' por el nombre de tu colección
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFreelancerData(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching freelancer data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFreelancerData();
  }, [freelancerId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  if (!freelancerData) {
    return <Text>No se encontraron datos del freelancer.</Text>;
  }

  const { 
    nombres, 
    apellidos, 
    nombre_usuario, 
    email, 
    password, // Nuevo campo
    num_cedula, // Nuevo campo
    foto_cedula_front, // Nuevo campo
    foto_cedula_back, // Nuevo campo
    foto_perfil, // Nuevo campo
    municipio, 
    departamento, 
    nivel, 
    id_profesion, // Nuevo campo
    descripcion,
    calificacion_promedio, // Nuevo campo
    num_trabajos_completados, // Nuevo campo
    estado_disponibilidad, // Nuevo campo
    portafolio, // Nuevo campo
    certificaciones, // Nuevo campo
    idiomas_hablados, // Nuevo campo
    experiencia_profesional, // Nuevo campo
    preferencias_trabajo, // Nuevo campo
    metodos_pago_aceptados, // Nuevo campo
    avisos_disponibilidad, // Nuevo campo
    enlaces_redes_sociales, // Nuevo campo
    suscripciones, // Nuevo campo
    // ... otros campos que desees mostrar ...
  } = freelancerData;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{`${nombres} ${apellidos}`}</Text>
      <Text style={styles.subtitle}>Nombre de Usuario: {nombre_usuario}</Text>
      <Text style={styles.subtitle}>Descripción: {descripcion}</Text>
      <Text style={styles.subtitle}>Correo Electrónico: {email}</Text>
      <Text style={styles.subtitle}>Contraseña: {password}</Text> {/* Nuevo campo */}
      <Text style={styles.subtitle}>Número de Cédula: {num_cedula}</Text> {/* Nuevo campo */}
      <Text style={styles.subtitle}>Municipio: {municipio}</Text>
      <Text style={styles.subtitle}>Departamento: {departamento}</Text>
      <Text style={styles.subtitle}>Nivel: {nivel}</Text>
      <Text style={styles.subtitle}>ID Profesión: {id_profesion}</Text> {/* Nuevo campo */}
      <Text style={styles.subtitle}>Calificación Promedio: {calificacion_promedio}</Text> {/* Nuevo campo */}
      <Text style={styles.subtitle}>Trabajos Completados: {num_trabajos_completados}</Text> {/* Nuevo campo */}
      <Text style={styles.subtitle}>Estado de Disponibilidad: {estado_disponibilidad}</Text> {/* Nuevo campo */}
      <Text style={styles.subtitle}>Portafolio: {portafolio.join(', ')}</Text> {/* Nuevo campo */}
      <Text style={styles.subtitle}>Certificaciones: {certificaciones.join(', ')}</Text> {/* Nuevo campo */}
      <Text style={styles.subtitle}>Idiomas Hablados: {idiomas_hablados.join(', ')}</Text> {/* Nuevo campo */}
      <Text style={styles.subtitle}>Experiencia Profesional: {experiencia_profesional}</Text> {/* Nuevo campo */}
      <Text style={styles.subtitle}>Preferencias de Trabajo: {JSON.stringify(preferencias_trabajo)}</Text> {/* Nuevo campo */}
      <Text style={styles.subtitle}>Métodos de Pago Aceptados: {metodos_pago_aceptados.join(', ')}</Text> {/* Nuevo campo */}
      <Text style={styles.subtitle}>Avisos de Disponibilidad: {avisos_disponibilidad}</Text> {/* Nuevo campo */}
      <Text style={styles.subtitle}>Enlaces a Redes Sociales: 
        {Object.entries(enlaces_redes_sociales).map(([red, url]) => (
          <Text key={red}>{`${red}: ${url}`}</Text>
        ))}
      </Text> {/* Nuevo campo */}
      <Text style={styles.subtitle}>Suscripciones: 
        {Object.entries(suscripciones).map(([id, subs]) => (
          <Text key={id}>{`Tipo: ${subs.tipo_suscripcion}, Estado: ${subs.estado_suscripcion}`}</Text>
        ))}
      </Text> {/* Nuevo campo */}
      {/* Aquí puedes agregar más campos según sea necesario */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 5,
  },
});

export default FreelancerProfile;
