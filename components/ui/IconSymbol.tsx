// cspell:disable
import React from "react";
import { type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

// ...existing code...
const MAPPING = {
  home: "home",
  menu: "menu",
  search: "search",
  close: "close",
  cart: "shopping-cart",
  user: "person",
} as const;
// ...existing code...

type MappingKey = keyof typeof MAPPING;

type IconSymbolProps = {
  name: MappingKey;
  size?: number;
  color?: string;
  style?: StyleProp<TextStyle | ViewStyle>;
};

export default function IconSymbol({ name, size = 24, color, style }: IconSymbolProps) {
  // MaterialIcons espera TextStyle — fazemos cast seguro aqui
  return <MaterialIcons name={MAPPING[name]} size={size} color={color} style={style as StyleProp<TextStyle>} />;
}
// ...existing code...