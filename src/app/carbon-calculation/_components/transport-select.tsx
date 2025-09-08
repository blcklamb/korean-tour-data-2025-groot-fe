import { Card, Flex, SimpleGrid } from "@mantine/core";
import { TransportSelectProps } from "./types";

export function TransportSelect(props: TransportSelectProps) {
  const { options, selected, onSelect, getIcon, getLabel } = props;
  return (
    <SimpleGrid cols={3} spacing="xs">
      {options.map((item) => (
        <Card
          key={item.id}
          withBorder
          padding="xs"
          className={`cursor-pointer hover:bg-gray-100 ${
            item.value && selected?.value && item.value === selected.value
              ? "bg-green-100 border-green-600"
              : ""
          }`}
          onClick={() => onSelect(item)}
        >
          <Flex
            direction={"column"}
            justify={"center"}
            align="center"
            gap="xs"
            h={"100%"}
          >
            <span>{getIcon ? getIcon(item) : item.icon}</span>
            <span style={{ fontSize: "12px" }}>
              {getLabel ? getLabel(item) : item.label || item.value}
            </span>
          </Flex>
        </Card>
      ))}
    </SimpleGrid>
  );
}
