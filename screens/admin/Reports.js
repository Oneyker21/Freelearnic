import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Button } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../connection/firebaseConfig';
import { captureRef } from 'react-native-view-shot';
import { jsPDF } from 'jspdf';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function Reports() {
  const [dataProyectos, setDataProyectos] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

  const chartRef = useRef();

  // Lista de colores estáticos
  const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

  const captureChart = async () => {
    try {
      const uri = await captureRef(chartRef, {
        format: "png",
        quality: 1,
      });
      console.log("Imagen capturada en:", uri);
    } catch (error) {
      console.error("Error al capturar el gráfico:", error);
    }
  };

  const generarPDF = async () => {
    try {
      const uri = await captureRef(chartRef, {
        format: "png",
        quality: 1,
      });

      const doc = new jsPDF();
      doc.text("Reporte de Proyectos", 10, 10);

      const chartImage = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      doc.addImage(`data:image/png;base64,${chartImage}`, "PNG", 10, 20, 150, 110);

      dataProyectos.labels.forEach((label, index) => {
        const value = dataProyectos.datasets[0].data[index];
        doc.text(`${label}: ${value}`, 10, 140 + index * 10);
      });

      const pdfBase64 = doc.output('datauristring').split(',')[1];
      const fileUri = `${FileSystem.documentDirectory}reporte_proyectos.pdf`;

      await FileSystem.writeAsStringAsync(fileUri, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64
      });

      await Sharing.shareAsync(fileUri);
    } catch (error) {
      console.error("Error al generar o compartir el PDF: ", error);
    }
  };

  useEffect(() => {
    const recibirDatosProyectos = async () => {
      try {
        const q = query(collection(db, "Projects")); // Cambia a tu colección de proyectos
        const querySnapshot = await getDocs(q);

        const conteoTiposProyectos = {};

        querySnapshot.forEach((doc) => {
          const datosBD = doc.data();
          const { projectType, finalPrice } = datosBD;

          if (projectType) {
            if (!conteoTiposProyectos[projectType]) {
              conteoTiposProyectos[projectType] = finalPrice;
            } else {
              conteoTiposProyectos[projectType] += finalPrice;
            }
          }
        });

        const labels = Object.keys(conteoTiposProyectos);
        const dataCounts = Object.values(conteoTiposProyectos);

        const data = labels.map((label, index) => ({
          name: label,
          population: dataCounts[index],
          color: colors[index % colors.length], // Asignar color desde la lista
          legendFontColor: "#000",
          legendFontSize: 15,
        }));

        setDataProyectos({
          labels,
          datasets: [{ data: dataCounts }],
        });
      } catch (error) {
        console.error("Error al obtener documentos: ", error);
      }
    };

    recibirDatosProyectos();
  }, []);

  return (
    <View style={styles.container}>
      <View ref={chartRef} collapsable={false} style={styles.chartContainer}>
        <PieChart
          data={dataProyectos.datasets[0].data.map((value, index) => ({
            name: dataProyectos.labels[index],
            population: value,
            color: colors[index % colors.length], // Asignar color desde la lista
            legendFontColor: "#000",
            legendFontSize: 15,
          }))}
          width={300}
          height={220}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>
      <Button title="Generar y Compartir PDF" onPress={generarPDF} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  chartContainer: {
    width: 300,
    height: 220,
    backgroundColor: '#fff',
  },
});
