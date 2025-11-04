import { memo } from "react";
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { colors } from "../theme/colors";
import { strings } from "../strings";
import {
  getResponsiveFontSize,
  getResponsivePadding,
} from "../utils/responsive";

interface SearchBarProps {
  value: string;
  placeholder?: string;
  onChangeText: (text: string) => void;
  autoFocus?: boolean;
}

const SearchBarComponent = ({ value, placeholder, onChangeText, autoFocus }: SearchBarProps) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={styles.input}
        autoCorrect={false}
        autoCapitalize="none"
        autoFocus={autoFocus}
        clearButtonMode="while-editing"
        returnKeyType="search"
      />
      {Platform.OS === "android" && value ? (
        <Pressable
          onPress={() => onChangeText("")}
          accessibilityRole="button"
          accessibilityLabel={strings.clearSearch}
          style={styles.clearButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.clearText}>×</Text>
        </Pressable>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: getResponsivePadding(12),
    paddingVertical: getResponsivePadding(8),
    backgroundColor: colors.surface,
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: getResponsiveFontSize(16),
    color: colors.text.primary,
    paddingRight: 8,
  },
  clearButton: {
    marginLeft: 4,
  },
  clearText: {
    fontSize: getResponsiveFontSize(18),
    color: colors.text.tertiary,
    lineHeight: getResponsiveFontSize(18),
  },
});

export const SearchBar = memo(SearchBarComponent);

export default SearchBar;

