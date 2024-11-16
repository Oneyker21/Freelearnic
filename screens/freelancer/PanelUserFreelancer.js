import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const PanelUserFreelancer = ({ route }) => {
  const navigation = useNavigation();
  const { freelancerId } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{ uri: 'https://ejemplo.com/foto-perfil.jpg' }}
          style={styles.profileImage}
        />
        <Text style={styles.name}>Cristhian Cesar Vargas Martinez</Text>
        <Text style={styles.username}>Angelica_R</Text>
      </View>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Ionicons name="call-outline" size={24} color="gray" />
          <Text style={styles.infoText}>(505) 8859-9564</Text>
        </View>
        <View style={styles.infoItem}>
          <MaterialIcons name="email" size={24} color="gray" />
          <Text style={styles.infoText}>rodriguezrosa203@gmail.com</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Configuración</Text>

      <TouchableOpacity style={styles.menuItem}>
        <MaterialIcons name="assignment" size={24} color="black" />
        <Text style={styles.menuItemText}>Mis proyectos</Text>
        <MaterialIcons name="chevron-right" size={24} color="gray" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.menuItem}
        onPress={() => navigation.navigate('FreelancerProfile', { freelancerId })}
      >
        <MaterialIcons name="person" size={24} color="black" />
        <Text style={styles.menuItemText}>Cuenta</Text>
        <MaterialIcons name="chevron-right" size={24} color="gray" />
      </TouchableOpacity>

      
      <TouchableOpacity style={styles.menuItem}>
        <Ionicons name="settings-outline" size={24} color="black" />
        <Text style={styles.menuItemText}>Ajustes</Text>
        <MaterialIcons name="chevron-right" size={24} color="gray" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.menuItem}>
        <MaterialIcons name="group-add" size={24} color="black" />
        <Text style={styles.menuItemText}>Invitar a amigos</Text>
        <MaterialIcons name="chevron-right" size={24} color="gray" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#2196F3',
    alignItems: 'center',
    padding: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  username: {
    fontSize: 16,
    color: '#e0e0e0',
  },
  infoContainer: {
    padding: 20,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuItemText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
});

export default PanelUserFreelancer;
  