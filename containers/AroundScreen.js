import { Text, View, useWindowDimensions, StyleSheet } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigation } from "@react-navigation/core";

export default function AroundScreen() {
	const navigation = useNavigation();
	// pour les coordonnées de l'user
	const [coords, setCoords] = useState();
	// pour les données récupérées du serveur
	const [data, setData] = useState([]);

	const styles = useStyle();
	useEffect(() => {
		const askPermission = async () => {
			// Pour notre exemple on va se mettre sur paris

			const latitude = 48.856614;

			const longitude = 2.3522219;
			let { status } = await Location.requestForegroundPermissionsAsync();

			if (status === "granted") {
				let location = await Location.getCurrentPositionAsync({});

				const obj = {
					latitude: location.coords.latitude,
					longitude: location.coords.longitude,
				};
				setCoords(obj);
			} else {
				alert(
					"In order to optimize your experience, we recommend you to accept to give your location"
				);
			}

			try {
				const response = await axios.get(
					`https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/around?latitude=${latitude}&longitude=${longitude}`
				);

				setData(response.data);
			} catch (error) {
				console.log("error", error);
			}
		};

		askPermission();
	}, []);

	return (
		<View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
			<MapView
				provider={PROVIDER_GOOGLE}
				// La MapView doit obligatoirement avoir des dimensions
				style={styles.mapBloc}
				initialRegion={{
					latitude: 48.856614,
					longitude: 2.3522219,
					latitudeDelta: 0.2,
					longitudeDelta: 0.2,
				}}
				// showsUserLocation={true} // dans le cas où les coordonnées de initial Region sont dynamiques et adaptés à la position de l'utilisateur
			>
				{data.map((element) => {
					return (
						<Marker
							key={element._id}
							coordinate={{
								latitude: element.location[1],
								longitude: element.location[0],
							}}
							title={element.title}
							description={element.description}
							onPress={() => {
								navigation.navigate("RoomDetailsMap", { id: element._id });
							}}
						/>
					);
				})}
			</MapView>
		</View>
	);
}

const useStyle = () => {
	const { width, height } = useWindowDimensions();

	const styles = StyleSheet.create({
		mapBloc: {
			width: "100%",
			height: "100%",
		},
	});

	return styles;
};
