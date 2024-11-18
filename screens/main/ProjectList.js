import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
  Dimensions,
  StatusBar,
} from "react-native";
import { db } from "../../connection/firebaseConfig";
import { collection, addDoc, onSnapshot, getDoc, doc } from "firebase/firestore";
import ProposalModal from "../freelancer/ProposalModal";
import { CustomPicker } from "../../utils/inputs";
import CustomText from "../../utils/CustomText";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const ProjectList = ({ route, showProposalButton }) => {
  const { freelancerId } = route.params;

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const projectType = [
    { label: "Todos", value: "" },
    { label: "Desarrollo de Software", value: "Desarrollo de Software" },
    { label: "Programación", value: "Programación" },
    { label: "Diseño Gráfico", value: "Diseño Gráfico" },
    { label: "Marketing Digital", value: "Marketing Digital" },
    { label: "Base de datos", value: "Base de datos" },
    { label: "Desarrollo Web", value: "Desarrollo Web" },
  ];


  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "Projects"),
      async (querySnapshot) => {
        const projectsData = [];
        for (const docSnapshot of querySnapshot.docs) {
          const project = {
            id: docSnapshot.id,
            ...docSnapshot.data(),
          };
          console.log("Procesando proyecto con ID:", project.id);
          console.log("Client ID del proyecto:", project.clientID);
  
          const clientRef = doc(db, "Clients", project.clientID);
          const clientDoc = await getDoc(clientRef);
          if (clientDoc.exists()) {
            const clientData = clientDoc.data();
            project.clientName = clientData.firstName + " " + clientData.lastName;
            console.log("Nombre del cliente encontrado:", project.clientName);
          } else {
            project.clientName = "Cliente desconocido";
            console.log("No se encontró el documento para el clientID:", project.clientID);
          }
          projectsData.push(project);
        }
        setProjects(projectsData);
        filterProjects(searchQuery, categoryFilter, projectsData);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching projects: ", error);
        setLoading(false);
      }
    );
  
    return () => unsubscribe();
  }, [categoryFilter]);






  const filterProjects = (text, type, projectsData) => {
    let filtered = projectsData;

    if (type !== "") {
      filtered = filtered.filter((project) => project.projectType === type);
    }

    if (text !== "") {
      filtered = filtered.filter((project) =>
        project.title.toLowerCase().includes(text.toLowerCase())
      );
    }

    setFilteredProjects(filtered);
  };
  

  const handleSearchPress = () => {
    filterProjects(searchQuery, categoryFilter, projects);
  };

  const enviarPropuesta = async (projectId, proposalData) => {
    try {
      const Proposal = {
        freelancerID: freelancerId,
        projectID: projectId,
        proposedPrice: proposalData.proposedPrice,
        proposalMessage: proposalData.proposalMessage,
        proposalStatus: "pendiente",
        proposalDate: new Date().toISOString(),
        clientID: proposalData.clientID,
      };
      await addDoc(collection(db, "Proposals"), Proposal);
      Alert.alert("Propuesta enviada");
    } catch (error) {
      console.error("Error al enviar la propuesta: ", error);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#007AFF" />;
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Barra de estado personalizada */}
      <StatusBar
        barStyle="light-content"
        backgroundColor="#107ACC"
      />
      
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Buscar"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.searchButton}
          onPress={handleSearchPress}
        >
          <Ionicons name="search" size={26} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.textTitle}>Algunos proyectos</Text>
      </View>

      <FlatList
        data={filteredProjects}
        keyExtractor={(item) => item.id}
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

            <View style={styles.projectClientContainer}>
              <Text style={styles.titleClient}>Cliente:</Text>
              <Text style={styles.projectUser}>{item.clientName}</Text>
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

            {showProposalButton && (
              <TouchableOpacity
                onPress={() => {
                  setSelectedProjectId(item.id);
                  setSelectedClientId(item.clientID);
                  setModalVisible(true);
                }}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Enviar Propuesta</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      <ProposalModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={(proposalData) => {
          proposalData.clientID = selectedClientId;
          enviarPropuesta(selectedProjectId, proposalData);
          setModalVisible(false);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: width * 0.025,
  },
  searchBar: {
    flex: 1,
    height: height * 0.05,
    borderColor: "#ccc",
    backgroundColor: "#D9D9D9",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: width * 0.025,
    marginLeft: width * 0.001,
  },
  searchButton: {
    height: height * 0.049,
    backgroundColor: "#007AFF",
    paddingVertical: height * 0.009,
    paddingHorizontal: width * 0.03,
    borderRadius: 8,
    marginLeft: width * 0.02,
  },
  projectItem: {
    padding: height * 0.02,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  projectTypeTitle: {
    fontWeight: "bold",
    color: "#142157",
  },
  projectUserTitle: {
    fontWeight: "bold",
    color: "#142157",
  },
  projectDescriptionTitle: {
    fontWeight: "bold",
    color: "#142157",
  },
  logo: {
    width: width * 0.13,
    height: width * 0.13,
    position: "absolute",
    top: height * 0.01,
    left: width * 0.015,
    zIndex: 1,
  },
  projectDescriptionContainer: {
    flexDirection: "row",
    marginVertical: height * 0.01,
  },
  projectDescription: {
    fontWeight: "bold",
    flexDirection: "row",
    fontSize: width * 0.04,
    marginLeft: width * 0.042,
    marginRight: width * 0.05,
  },
  projectTypeContainer: {
    flexDirection: "row",
    marginVertical: height * 0.01,
  },
  projectTipoTitle: {
    color: "black",
    fontWeight: "bold",
  },
  tipoProyecto: {
    color: "rgba(21, 41, 124, 1)",
    fontWeight: "bold",
    marginRight: width * 0.015,
    marginLeft: width * 0.03,
  },
  projectUserContainer: {
    flexDirection: "row",
    marginVertical: height * 0.01,
  },
  projectUser: {
    marginRight: width * 0.03,
    color: "rgba(21, 41, 124, 1)",
    fontWeight: "bold",
  },
  projectType: {
    fontWeight: "bold",
  },
  projectTitle: {
    flexDirection: "row",
    fontWeight: "bold",
    fontSize: width * 0.05,
    borderWidth: 1,
    borderRadius: 8,
    paddingTop: height * 0.06,
    paddingBottom: height * 0.02,
    borderColor: "#107ACC",
    backgroundColor: "#107ACC",
    color: "white",
    textAlign: "center",
  },
  projectStatus: {
    width: width * 0.25,
    height: height * 0.04,
    borderWidth: 3,
    fontSize: width * 0.035,
    borderRadius: 6,
    borderColor: "#18D23A",
    backgroundColor: "#18D23A",
    right: width * 0.025,
    color: "white",
    padding: height * 0.01,
    paddingHorizontal: width * 0.04,
    zIndex: 1,
    position: "absolute",
    marginTop: height * 0.015,
    alignSelf: "flex-end",
  },
  textTitle: {
    fontWeight: "bold",
    fontSize: width * 0.045,
    color: "rgba(0, 0, 0, 0.61)",
    paddingTop: height * 0.02,
    marginLeft: width * 0.03,
    marginBottom: height * 0.01,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: height * 0.02,
    marginLeft: width * 0.022,
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
  projectPropuestas: {
    color: "#666",
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
