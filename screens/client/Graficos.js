import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

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
