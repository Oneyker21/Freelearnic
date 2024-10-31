import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../connection/firebaseConfig';

export default function Estadisticas() {
  const [dataProyectos, setDataProyectos] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

  useEffect(() => {
    const recibirDatosProyectos = async () => {
      try {
        const q = query(collection(db, "Proyecto")); // Cambia a tu colección de proyectos
        const querySnapshot = await getDocs(q);

        const conteoTiposProyectos = {};

        querySnapshot.forEach((doc) => {
          const datosBD = doc.data();
          const { tipo_proyecto, precio_final } = datosBD;

          if (tipo_proyecto) {
            if (!conteoTiposProyectos[tipo_proyecto]) {
              conteoTiposProyectos[tipo_proyecto] = precio_final;
            } else {
              conteoTiposProyectos[tipo_proyecto] += precio_final;
            }
          }
        });

        const labels = Object.keys(conteoTiposProyectos);
        const dataCounts = Object.values(conteoTiposProyectos);

        const data = labels.map((label, index) => ({
          name: label,
          population: dataCounts[index],
          color: `hsl(${Math.random() * 360}, 70%, 50%)`, // Color aleatorio para cada segmento
          legendFontColor: "#000", // Color del texto en la leyenda
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

  const generarPDF = async () => {
    try {
      // Capturar el gráfico como imagen
      const uri = await captureRef(chartRef, {
        format: "png",
        quality: 1,
        width: chartWidth,
        height: chartHeight,
      });

      // Crear una instancia de jsPDF
      const doc = new jsPDF();

      // Agregar título al PDF
      doc.text("Reporte de Géneros", 10, 10);

      // Leer la imagen capturada y agregarla al PDF
      const chartImage = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      doc.addImage(`data:image/png;base64,${chartImage}`, "PNG", 10, 20, 150, 110);

      // Agregar los datos al PDF
      dataGeneros.forEach((item, index) => {
        const { name, population } = item;
        doc.text(`${name}: ${population}`, 10, 140 + index * 10); // Ajustar posición para dejar espacio a la imagen
      });

      // Generar el PDF como base64
      const pdfBase64 = doc.output('datauristring').split(',')[1];

      // Definir la ruta temporal para el archivo PDF en el sistema de archivos del dispositivo
      const fileUri = `${FileSystem.documentDirectory}reporte_generos.pdf`;

      // Guardar el archivo PDF
      await FileSystem.writeAsStringAsync(fileUri, pdfBase64, {
        encoding: FileSystem.EncodingType.Base64
      });

      // Compartir el archivo PDF
      await Sharing.shareAsync(fileUri);
      
    } catch (error) {
      console.error("Error al generar o compartir el PDF: ", error);
      Alert.alert('Error', 'No se pudo generar o compartir el PDF.');
    }
  };

  return (
    <View style={styles.container}>
      <PieChart
        data={dataProyectos.datasets[0].data.map((value, index) => ({
          name: dataProyectos.labels[index],
          population: value,
          color: `hsl(${Math.random() * 360}, 70%, 50%)`, // Color aleatorio para cada segmento
          legendFontColor: "#000", // Color del texto en la leyenda
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
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
