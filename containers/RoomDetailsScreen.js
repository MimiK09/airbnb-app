import {
	Text,
	TextInput,
	View,
	TouchableOpacity,
	Image,
	useWindowDimensions,
	StyleSheet,
	ScrollView,
	Alert,
	SafeAreaView,
	ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios"; // à installer
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"; // à installer
import Constants from "expo-constants";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

// j'importe navigation en prop si pas déjà importé dans le screen
export default function RoomDetailsScreen({ navigation, route }) {
	const { id } = route.params;
	const styles = useStyle();
	// console.log("route", id);
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const getRoomDetails = async () => {
			try {
				const response = await axios.get(
					`https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/${id}`
				);
				setData(response.data);
				setIsLoading(false);
			} catch (error) {
				console.log("error", error.response);
			}
		};

		getRoomDetails();
	}, []);

	ratingFunc = (number) => {
		let nbfullStar = number;
		let stars = [];

		for (let i = 0; i < nbfullStar; i++) {
			stars.push(
				<FontAwesome
					key={`empty-star-${i}`}
					name="star"
					size={16}
					color="black"
					style={styles.fullStar}
				/>
			);
		}

		for (let i = 5; i > nbfullStar; i--) {
			stars.push(
				<FontAwesome
					key={`empty-star-${i}`}
					name="star"
					size={16}
					color="black"
					style={styles.emptyStar}
				/>
			);
		}

		return stars;
	};

	return (
		<SafeAreaView contentContainerStyle={[styles.container]}>
			<ScrollView style={[styles.whBloc]}>
				{isLoading ? (
					<View>
						<ActivityIndicator />
					</View>
				) : (
					<View style={[styles.mainBloc]}>
						<View style={[styles.topBloc]}>
							<View style={styles.blocImgRoom}>
								{data.photos && data.photos.length > 0 && (
									<Image
										source={{ uri: data.photos[0].url }}
										style={styles.imgRoom}
									/>
								)}
								<Text style={styles.blocPriceImgRoom}>{data.price} €</Text>
							</View>
							<View style={styles.descBloc}>
								<View>
									<Text style={styles.titleRoom}>{data.title}</Text>
									<View style={styles.ratingBloc}>
										<View style={styles.ratingBloc}>
											{ratingFunc(data.ratingValue)}
										</View>
										<Text>{data.reviews} reviews</Text>
									</View>
								</View>
								<Image
									source={{ uri: data.user?.account?.photo?.url }}
									style={styles.userImg}
								/>
							</View>
							<View>
								<Text>{data.description}</Text>
							</View>
						</View>
						<View>
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
								<Marker
									coordinate={{
										latitude: data.location[1],
										longitude: data.location[0],
									}}
								/>
							</MapView>
						</View>
					</View>
				)}
			</ScrollView>
		</SafeAreaView>
	);
}

const useStyle = () => {
	const { width, height } = useWindowDimensions();

	const styles = StyleSheet.create({
		container: {
			paddingtop: Constants.statusBarHeight,
		},
		whBloc: {
			backgroundColor: "#fff",
		},
		mainBloc: {
			display: "flex",
			justifyContent: "space-between",
			alignSelf: "center",
		},
		topBloc: { width: "90%", marginBottom: 20 },
		imgLogo: {
			width: 50,
			height: 50,
			resizeMode: "contain",
			marginVertical: 10,
		},

		titleSign: {

			fontSize: 24,
			marginVertical: 10,
		},
		blocImgRoom: {
			position: "relative",
		},
		imgRoom: {
			aspectRatio: 4 / 2,
			width: "100%",
		},
		blocPriceImgRoom: {
			position: "absolute",
			bottom: 10,
			color: "white",
			backgroundColor: "black",
			fontWeight: 800,
			padding: 5,
		},
		descBloc: {
			flexDirection: "row",
			justifyContent: "space-between",
			alignItems: "center",
			marginVertical: 20,
		},
		titleRoom: {
			fontSize: 16,
			fontWeight: "bold",
			width: 250,
			marginVertical: 5,
		},
		fullStar: {
			color: "#ffb100",
		},
		emptyStar: {
			color: "#bbbbbb",
		},
		ratingBloc: {
			flexDirection: "row",
			gap: 2,
			alignItems: "center",
		},
		userImg: {
			width: 50,
			height: 50,
			resizeMode: "contain",
			borderRadius: 25,
		},
		mapBloc: {
			width: "100%",
			height: 300,
			alignSelf: "center",
		},
	});

	return styles;
};
