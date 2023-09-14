import { useNavigation } from "@react-navigation/core";
import { Feather } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import {
	Button,
	Text,
	View,
	useWindowDimensions,
	FlatList,
	StyleSheet,
	ScrollView,
	SafeAreaView,
	Image,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Constants from "expo-constants";

export default function HomeScreen() {
	const navigation = useNavigation();
	const styles = useStyle();
	const [data, setData] = useState([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const getRooms = async () => {
			try {
				const response = await axios.get(
					"https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms"
				);
				setData(response.data);
				setIsLoading(false);
			} catch (error) {
				console.log("error home", error);
			}
		};

		getRooms();
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
		<SafeAreaView style={styles.container}>
			{isLoading ? (
				<ActivityIndicator />
			) : (
				<View style={styles.mainBloc}>
					<FlatList
						data={data}
						keyExtractor={(item) => item._id}
						renderItem={(element) => {
							return (
								<TouchableOpacity
									style={styles.room}
									onPress={() => {
										console.log("je passe");
										navigation.navigate("RoomDetails", {
											id: element.item._id,
										});
									}}
								>
									<View style={styles.blocImgRoom}>
										<Image
											source={{ url: element.item.photos[0].url }}
											style={styles.imgRoom}
										/>
										<Text style={styles.blocPriceImgRoom}>
											{element.item.price} €
										</Text>
									</View>
									<View style={styles.descBloc}>
										<View>
											<Text style={styles.titleRoom} numberOfLines={1}>
												{element.item.title}
											</Text>
											<View style={styles.ratingBloc}>
												<View style={styles.ratingBloc}>
													{ratingFunc(element.item.ratingValue)}
												</View>
												<Text>{element.item.reviews} reviews</Text>
											</View>
										</View>

										<Image
											source={{ url: element.item.user.account.photo.url }}
											style={styles.userImg}
										/>
									</View>
								</TouchableOpacity>
							);
						}}
					></FlatList>
				</View>
			)}
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
		room: {
			marginVertical: 10,
			borderBottomWidth: 0.5,
			borderBottomColor: "#bbbbbb",
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
			fontWeight:"bold",
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
