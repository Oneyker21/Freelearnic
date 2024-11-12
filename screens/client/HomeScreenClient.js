import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { db } from '../../connection/firebaseConfig';
import { getDoc, doc } from 'firebase/firestore';
import ProjectList from '../main/ProjectList';

const { width, height } = Dimensions.get('window');

const HomeScreenSb = ({ route }) => {
  const navigation = useNavigation();
  const { clientId } = route.params;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const docRef = doc(db, 'Clients', clientId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // Aquí puedes manejar los datos si es necesario
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching client data: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, [clientId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.textTitle}>Bienvenido a</Text>
        <Text style={styles.textTitle2}>Freelearnic</Text>
        <Text style={styles.textTitle3}>Explora los demás proyectos</Text>
      </View>
      <ProjectList route={{ params: { clientId } }} showProposalButton={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    width: width * 1,
    alignSelf: 'center',
    marginTop: height * 0.001,
  },
  textContainer: {
    paddingTop: height * 0.01,
    marginLeft: width * 0.03,
    paddingBottom: height * 0.02,
  },
  textTitle: {
    fontWeight: '400',
    fontSize: width * 0.04,
    color: 'rgba(0, 0, 0, 0.61)',
  },
  textTitle2: {
    fontWeight: 'bold',
    fontSize: width * 0.06,
    color: 'rgba(0, 0, 0, 0.61)',
  },
  textTitle3: {
    fontWeight: 'bold',
    fontSize: width * 0.06,
    color: 'rgba(0, 0, 0, 0.61)',
  },
  buttonContainer: {
    marginBottom: height * 0.02,
  },
});

export default HomeScreenSb;
