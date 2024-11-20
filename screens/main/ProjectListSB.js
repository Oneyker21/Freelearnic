import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  FlatList,
  StatusBar,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { db } from '../../connection/firebaseConfig'; // Asegúrate de que la ruta sea correcta
import { collection,onSnapshot,getDoc,doc } from 'firebase/firestore';
import CustomText from '../../utils/CustomText';

const { width, height } = Dimensions.get("window");

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'Projects'), async (querySnapshot) => {
      const projectsData = await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
        const data = docSnapshot.data();
        const clientRef = doc(db, 'Clients', data.clientID);
        const clientDoc = await getDoc(clientRef);
        const clientData = clientDoc.exists() ? clientDoc.data() : { firstName: 'Desconocido', lastName: '' };
        return {
          id: docSnapshot.id,
          ...data,
          clientName: `${clientData.firstName} ${clientData.lastName}`
        };
      }));
      setProjects(projectsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching projects: ', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.textContainer}>
        <Text style={styles.textTitle}>Algunos proyectos</Text>
      </View>

      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        style={styles.FlatContainer}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image
              source={require("../../assets/img/IconoCards.png")}
              style={styles.logo}
            />
            <CustomText style={styles.projectStatus} fontFamily="Roboto">
              {item.projectStatus}
            </CustomText>
            <Text style={styles.projectTitle}>{item.title}</Text>

            <View style={styles.projectTypeContainer}>
              <Text style={styles.tipoProyecto}> Tipo de Proyecto:</Text>
              <Text style={styles.projectTipoTitle}>{item.projectType}</Text>
            </View>

            <View style={styles.projectUserContainer}>
              <CustomText style={styles.projectUserTitle} fontFamily="OpenSans">Cliente:</CustomText>
              <CustomText style={styles.projectUser} fontFamily="OpenSans">{item.clientName}</CustomText>
            </View>

            <Text style={styles.projectDescription}>{item.description}</Text>

            <View style={styles.priceContainer}>
              <Text style={styles.projectPriceTitle}> Rango de precio:</Text>
              <Text style={styles.projectPrecio}>
                {item.minPrice ? `\$${item.minPrice}` : "No especificado"} -{" "}
                {item.maxPrice ? `\$${item.maxPrice}` : "No especificado"}
              </Text>
            </View>

            <View style={styles.projectFechaEntregaContainer}>
              <Text style={styles.projectFechaEntrega}>
                Fecha Estimada de Entrega:
              </Text>
              <Text style={styles.projectFechaEntrega2}>
                {item.estimatedDeliveryDate
                  ? item.estimatedDeliveryDate
                  : "No especificada"}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  textTitle: {
    fontWeight: "bold",
    fontSize: width * 0.045,
    color: "rgba(0, 0, 0, 0.61)",
    marginLeft: width * 0.01,
    marginBottom: height * 0.02,
  },
  logo: {
    width: width * 0.13,
    height: width * 0.13,
    position: "absolute",
    top: height * 0.01,
    left: width * 0.015,
    zIndex: 1,
  },
  projectDescription: {
    fontWeight: "bold",
    fontSize: width * 0.04,
    marginLeft: width * 0.042,
    marginRight: width * 0.05,
  },
  projectTypeContainer: {
    flexDirection: "row",
    marginVertical: height * 0.01,
  },
  tipoProyecto: {
    color: "rgba(21, 41, 124, 1)",
    fontWeight: "bold",
    marginRight: width * 0.015,
    marginLeft: width * 0.03,
  },
  projectTipoTitle: {
    color: "black",
    fontWeight: "bold",
  },
  projectClientContainer: {
    flexDirection: "row",
    marginBottom: height * 0.005,
  },
  titleClient: {
    color: "rgba(21, 41, 124, 1)",
    fontWeight: "bold",
    marginLeft: width * 0.04,
    marginRight: width * 0.005,
  },
  projectUser: {
    color: "rgba(21, 41, 124, 1)",
    fontWeight: "bold",
    fontSize: width * 0.035,
  },
  projectUserTitle: {
    color: "rgba(21, 41, 124, 1)",
    fontWeight: "bold",
    fontSize: width * 0.035,
    flexDirection: "row",
    marginBottom: height * 0.005,
    marginLeft: width * 0.040,
  },
  projectUserContainer: {
    flexDirection: "row",
    marginBottom: height * 0.005,
  },
  projectTitle: {
    fontWeight: "bold",
    fontSize: width * 0.05,
    borderWidth: 1,
    borderRadius: 8,
    paddingTop: height * 0.07,
    paddingBottom: height * 0.02,
    borderColor: "#107ACC",
    backgroundColor: "#107ACC",
    color: "white",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: height * 0.02,
    marginLeft: width * 0.005,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.62,
    elevation: 4,
    width: width * 0.95,
  },
  priceContainer: {
    flexDirection: "column",
    marginVertical: height * 0.01,
    marginRight: width * 0.05,
    paddingLeft: 0,
    paddingRight: width * 0.1,
    paddingTop: height * 0.015,
    paddingBottom: height * 0.015,
    borderWidth: 1,
    borderColor: "#107ACC",
    borderRadius: 12,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  projectPriceTitle: {
    fontSize: width * 0.035,
    fontWeight: "bold",
    color: "#007AFF",
  },
  projectPrecio: {
    marginLeft: width * 0.04,
    fontWeight: "bold",
    fontSize: width * 0.04,
  },
  projectStatus: {
    width: width * 0.27,
    height: height * 0.04,
    borderWidth: 3,
    fontSize: width * 0.035,
    borderRadius: 6,
    borderColor: "#18D23A",
    backgroundColor: "#18D23A",
    right: width * 0.025,
    color: "white",
    padding: height * 0.0051,
    paddingHorizontal: width * 0.04,
    zIndex: 1,
    position: "absolute",
    marginTop: height * 0.015,
    alignSelf: "flex-end",
  },
  FlatContainer: {
    marginBottom: 0,
  },
  projectFechaEntregaContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginBottom: height * 0.02,
    marginRight: width * 0.08,
  },
  projectFechaEntrega: {
    color: "rgba(21, 41, 124, 1)",
    fontSize: width * 0.033,
    fontWeight: "bold",
    marginRight: width * 0.015,
  },
  projectFechaEntrega2: {
    color: "black",
    fontSize: width * 0.033,
    fontWeight: "bold",
    alignSelf: "flex-end",
  },
});

export default ProjectList;
