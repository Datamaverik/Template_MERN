import { HStack, Switch, Text, useColorMode } from "@chakra-ui/react";

const ColorModeSwithc = () => {
  const { toggleColorMode, colorMode } = useColorMode();
  return (
    <HStack>
      <Switch
        colorScheme="blue"
        isChecked={colorMode === "dark"}
        onChange={toggleColorMode}
      />
      <Text whiteSpace="nowrap">
        {colorMode === "light" ? "Dark" : "Light"}
      </Text>
    </HStack>
  );
};

export default ColorModeSwithc;
