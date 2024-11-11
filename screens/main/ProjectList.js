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
} from "react-native";
import { db } from "../../connection/firebaseConfig";
import { collection, addDoc, onSnapshot } from "firebase/firestore";
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
      (querySnapshot) => {
        const projectsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
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
              <Text style={styles.titleClient}>Cliente ID:</Text>
              <Text style={styles.projectUser}>{item.clientID}</Text>
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
    margin: 10,
  },
  searchBar: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    backgroundColor: "#D9D9D9",
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 10,
    marginLeft: 3,
  },
  searchButton: {
    height: 40,
    backgroundColor: "#007AFF",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginLeft: 8,
    marginHorizontal: 3,
  },
  projectItem: {
    padding: 15,
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
    width: 50,
    height: 50,
    position: "absolute",
    top: 0,
    left: 5,
    zIndex: 1,
  },
  projectDescriptionContainer: {
    flexDirection: "row",
    marginVertical: 5,
  },
  projectDescription: {
    fontWeight: "bold",
    flexDirection: "row",
    fontSize: 15,
    marginLeft: 20,
    marginRight: 20,
  },
  projectTypeContainer: {
    flexDirection: "row",
    marginVertical: 5,
  },
  projectTipoTitle: {
    color: "black",
    fontWeight: "bold",
  },
  tipoProyecto: {
    color: "rgba(21, 41, 124, 1)",
    fontWeight: "bold",
    marginRight: 2,
    marginLeft: 15,
  },
  projectUserContainer: {
    flexDirection: "row",
    marginVertical: 5,
  },
  projectUser: {
    marginRight: 10,
    color: "rgba(21, 41, 124, 1)",
    fontWeight: "bold",
  },
  projectType: {
    fontWeight: "bold",
  },
  projectTitle: {
    flexDirection: "row",
    fontWeight: "bold",
    fontSize: 20,
    borderWidth: 1,
    borderRadius: 8,
    paddingTop: 50,
    paddingBottom: 20,
    borderColor: "#107ACC",
    backgroundColor: "#107ACC",
    color: "white",
    textAlign: "center",
  },
  projectStatus: {
    width: 100,
    height: 30,
    borderWidth: 3,
    fontSize: 14,
    borderRadius: 6,
    borderColor: "#18D23A",
    backgroundColor: "#18D23A",
    right: 10,
    color: "white",
    padding: 5,
    paddingHorizontal: 15,
    zIndex: 1,
    position: "absolute",
    marginTop: 10,
    alignSelf: "flex-end",
  },
  textTitle: {
    fontWeight: "bold",
    fontSize: 18,
    color: "rgba(0, 0, 0, 0.61)",
    paddingTop: 20,
    marginLeft: 13,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 15,
    marginLeft: 13,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2.62,
    elevation: 4,
    width: 380,
  },
  projectClientContainer: {
    flexDirection: "row",
    marginBottom: 2,
  },
  titleClient: {
    color: "rgba(21, 41, 124, 1)",
    fontWeight: "bold",
    marginLeft: 20,
    marginRight: 2,
  },
  priceContainer: {
    flexDirection: "column",
    marginVertical: 5,
    marginRight: 20,
    paddingLeft: 0,
    paddingRight: 40,
    paddingTop: 10,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: "#107ACC",
    borderRadius: 12,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  projectPriceTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#007AFF",
  },
  projectPrecio: {
    marginLeft: 15,
    fontWeight: "bold",
    fontSize: 16,
  },
  projectPropuestas: {
    color: "#666",
  },
  projectFechaEntregaContainer: {
    flexDirection: "row",
    alignSelf: "flex-end",
    marginBottom: 20,
    marginRight: 30,
  },
  projectFechaEntrega: {
    color: "rgba(21, 41, 124, 1)",
    fontSize: 13,
    fontWeight: "bold",
    marginRight: 5,
  },
  projectFechaEntrega2: {
    color: "black",
    fontSize: 13,
    fontWeight: "bold",
    alignSelf: "flex-end",
  },
});

export default ProjectList;
