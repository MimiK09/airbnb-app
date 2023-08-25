import { useNavigation } from "@react-navigation/core";
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
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Constants from "expo-constants";

export default function HomeScreen() {
	const navigation = useNavigation();
	const styles = useStyle();
	const [data, setData] = useState([]);

	useEffect(() => {
		const getRooms = async () => {
			const response = await axios.get(
				"https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms"
			);
			console.log("response.data", response.data);
			setData(response.data);
		};

		getRooms();
	}, []);

	return (
		<SafeAreaView style={styles.container}>
			<View>
				<Image source={require("../assets/ABNB.png")} style={styles.imgLogo} />
			</View>
			<FlatList
				data={data}
				keyExtractor={(item) => item._id}
				renderItem={(element) => {
					console.log("element", element);
				}}
			>
				<Text>test</Text>
			</FlatList>
		</SafeAreaView>
	);
}

const useStyle = () => {
	const { width, height } = useWindowDimensions();

	const styles = StyleSheet.create({
		container: {
			paddingtop: Constants.statusBarHeight,
			backgroundColor: "#fff",
		},
		imgLogo: {
			width: 50,
			height: 50,
			resizeMode: "contain",
			marginVertical: 10,
		},
		mainBloc: {
			backgroundColor: "#fff",
			height: "100%",
			justifyContent: "space-around",
		},
		centerBloc: {
			alignItems: "center",
		},
	});

	return styles;
};
