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
} from "react-native";
import { useState, useEffect } from "react";
import { Feather } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios"; // à installer
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view"; // à installer
import Constants from "expo-constants";

// j'importe navigation en prop si pas déjà importé dans le screen
export default function RoomDetailsScreen({ navigation, route }) {
	const { id } = route.params;
	const styles = useStyle();
	console.log("route", id);
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const getRoomDetails = async () => {
			try {
				console.log("je passe");
				const response = await axios.get(
					`https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/${id}`
				);

				console.log("response.data", response.data.photo);
				setData(response.data);
				setIsLoading(false);
				console.log("je passe2");
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
		<SafeAreaView contentContainerStyle={[styles.container, styles.container]}>
			<View>
				<Image source={require("../assets/ABNB.png")} style={styles.imgLogo} />
			</View>
			<ScrollView>
				<View>
					<View style={styles.blocImgRoom}>
						  <Image
							source={{ uri: data.photos[0].url }}
							style={styles.imgRoom}
						/>  
						<Text style={styles.blocPriceImgRoom}>{data.price} €</Text>
					</View>
					<View style={styles.descBloc}>
						<View>
							<Text style={styles.titleRoom} numberOfLines={1}>
								{data.title}
							</Text>
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
						<Text numberOfLines={3}>{data.description}</Text>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	);
}

const useStyle = () => {
	const { width, height } = useWindowDimensions();

	const styles = StyleSheet.create({
		container: {
			paddingtop: Constants.statusBarHeight,
			backgroundColor: "#fff",
			alignItems: "center",
		},
		mainBloc: {
			width: "90%",
		},
		imgLogo: {
			width: 50,
			height: 50,
			resizeMode: "contain",
			marginVertical: 10,
		},

		titleSign: {
			fontSize: 24,
			marginVertical: 5,
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
			marginVertical: 5,
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
	});

	return styles;
};
