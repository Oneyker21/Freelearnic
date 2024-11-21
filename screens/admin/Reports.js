import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import { PieChart, BarChart } from 'react-native-chart-kit';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../connection/firebaseConfig';
import { captureRef } from 'react-native-view-shot';
import { jsPDF } from 'jspdf';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

export default function Reports() {
  const [dataProyectos, setDataProyectos] = useState({
    labels: [],
    datasets: [{ data: [] }],
  });

  const [dataFreelancers, setDataFreelancers] = useState({
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

  const generarPDFConSVG = async () => {
    if (isGenerating) return;
    setIsGenerating(true);

    try {
      const total = dataProyectos.datasets[0].data.reduce((a, b) => a + b, 0);
      let acumulado = 0;

      const pieChartSVG = `
        <svg width="200" height="200" viewBox="-100 -100 200 200">
          ${dataProyectos.datasets[0].data.map((value, index) => {
            const porcentaje = (value / total) * 100;
            const anguloInicio = (acumulado / total) * 360;
            const anguloFin = ((acumulado + value) / total) * 360;
            acumulado += value;

            const inicioX = Math.cos((anguloInicio - 90) * Math.PI / 180) * 100;
            const inicioY = Math.sin((anguloInicio - 90) * Math.PI / 180) * 100;
            const finX = Math.cos((anguloFin - 90) * Math.PI / 180) * 100;
            const finY = Math.sin((anguloFin - 90) * Math.PI / 180) * 100;

            const esGranArco = porcentaje > 50 ? 1 : 0;

            return `
              <path d="M 0 0 L ${inicioX} ${inicioY} A 100 100 0 ${esGranArco} 1 ${finX} ${finY} Z"
                    fill="${colors[index % colors.length]}"
              />
            `;
          }).join('')}
        </svg>
      `;

      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .chart-container { 
                border: 1px solid #ccc;
                padding: 20px;
                margin: 20px 0;
                border-radius: 8px;
                text-align: center;
              }
              .legend-item {
                display: flex;
                align-items: center;
                margin: 10px 0;
                justify-content: center;
              }
              .color-box {
                width: 20px;
                height: 20px;
                margin-right: 10px;
                border-radius: 3px;
              }
            </style>
          </head>
          <body>
            <h1>Reporte de Proyectos</h1>
            <div class="chart-container">
              ${pieChartSVG}
              <div class="legend">
                ${dataProyectos.labels.map((label, index) => `
                  <div class="legend-item">
                    <div class="color-box" style="background-color: ${colors[index % colors.length]}"></div>
                    <div>${label}: ${dataProyectos.datasets[0].data[index]} proyectos 
                      (${(dataProyectos.datasets[0].data[index] / total * 100).toFixed(1)}%)
                    </div>
                  </div>
                `).join('')}
              </div>
              <p>Total de proyectos: ${total}</p>
              <p>Fecha de generación: ${new Date().toLocaleDateString()}</p>
            </div>
          </body>
        </html>
      `;

      const fechaActual = new Date().toISOString().slice(0, 10); // Formato AAAA-MM-DD
      const nombreArchivo = `Registros_TipoProyectosPDF_${fechaActual}.pdf`;

      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
        name: nombreArchivo // Asignar el nombre personalizado al archivo PDF
      });

      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartir reporte de proyectos'
      });
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', `No se pudo generar el PDF: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const generarPDFFreelancers = async () => {
    if (isGenerating) return;
    setIsGenerating(true);
  
    try {
      const total = dataFreelancers.datasets[0].data.reduce((a, b) => a + b, 0);
      const pieChartSVG = dataFreelancers.labels.map((label, index) => {
        const value = dataFreelancers.datasets[0].data[index];
        const percentage = (value / total) * 100;
        return `<div>${label}: ${value} (${percentage.toFixed(1)}%)</div>`;
      }).join('');
  
      const htmlContent = `
        <html>
          <body>
            <h1>Reporte de Freelancers</h1>
            <div>${pieChartSVG}</div>
            <p>Total de Freelancers: ${total}</p>
          </body>
        </html>
      `;
  
      const fechaActual = new Date().toISOString().slice(0, 10);
      const nombreArchivo = `Reporte_Freelancers_${fechaActual}.pdf`;
  
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
        name: nombreArchivo
      });
  
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Compartir reporte de Freelancers'
      });
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', `No se pudo generar el PDF: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };
  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, "Freelancers"));
      const data = querySnapshot.docs.map(doc => doc.data());
  
      const countByCity = {};
  
      data.forEach(freelancer => {
        const { city } = freelancer;
        if (city) {
          countByCity[city] = (countByCity[city] || 0) + 1;
        }
      });
  
      const chartData = {
        labels: Object.keys(countByCity),
        datasets: [{
          data: Object.values(countByCity)
        }]
      };
  
      setDataFreelancers(chartData);
    };
  
    fetchData();
  }, []);

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

  const [isGenerating, setIsGenerating] = useState(false);

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
      <Button title="Generar y Compartir PDF" onPress={generarPDFConSVG} />
      <View>
        <BarChart
          data={dataFreelancers}
          width={300}
          height={220}
          yAxisLabel=""
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          style={{
            marginVertical: 8,
            borderRadius: 16
          }}
        />
      </View>
      <Button title="Generar y Compartir PDF de Freelancers por Ciudad" onPress={generarPDFFreelancers} />
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
