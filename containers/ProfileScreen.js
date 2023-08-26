import { useRoute } from "@react-navigation/core";
import { Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ProfileScreen() {
	const { params } = useRoute();
	return (
		<View>
			<Text>
				user id :{" "}
				{async () => {
					const info = await AsyncStorage.getItem("token");
					return info;
				}}
			</Text>
		</View>
	);
}
