import { memo } from "react";
import { Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

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
          accessibilityLabel="Clear search text"
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
    borderColor: "#d1d5db",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#111827",
    paddingRight: 8,
  },
  clearButton: {
    marginLeft: 4,
  },
  clearText: {
    fontSize: 18,
    color: "#9ca3af",
    lineHeight: 18,
  },
});

export const SearchBar = memo(SearchBarComponent);

export default SearchBar;

