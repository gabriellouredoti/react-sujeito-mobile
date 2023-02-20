import React, { useContext, useState } from "react";
import {
	Text,
	View,
	SafeAreaView,
	TouchableOpacity,
	TextInput,
	StyleSheet,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { StackParams } from "../../routes/app.routes";
import { api } from "../../services/api";

export default function Dashboard() {
	const navigation = useNavigation<NativeStackNavigationProp<StackParams>>();

	const [number, setNumber] = useState("");

	async function openOrder() {
		try {
			if (!number) {
				return;
			}

			const response = await api.post("order", {
				table: Number(number),
			});

			const { id, table } = response.data;

			navigation.navigate("Order", {
				number: table,
				order_id: id,
			});
		} catch (error) {
			console.log("erro", error);
		}
	}

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Novo pedido</Text>
			<TextInput
				style={styles.input}
				placeholder="Número da mesa"
				placeholderTextColor="#f0f0f0"
				keyboardType="numeric"
				onChangeText={setNumber}
				value={number}
			/>
			<TouchableOpacity style={styles.button} onPress={openOrder}>
				<Text style={styles.buttonText}>Abrir Mesa</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingVertical: 15,
		backgroundColor: "#1d1d2e",
	},
	title: {
		fontSize: 30,
		fontWeight: "bold",
		color: "#fff",
		marginBottom: 24,
	},
	input: {
		width: "90%",
		height: 60,
		backgroundColor: "#101026",
		borderRadius: 4,
		paddingHorizontal: 8,
		textAlign: "center",
		fontSize: 22,
		color: "#fff",
	},
	button: {
		width: "90%",
		height: 40,
		backgroundColor: "#3fffa3",
		borderRadius: 4,
		marginVertical: 12,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonText: {
		color: "#101026",
		fontSize: 16,
		fontWeight: "bold",
	},
});
