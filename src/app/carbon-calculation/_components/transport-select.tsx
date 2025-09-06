import { Card, Flex, SimpleGrid } from "@mantine/core";
import { TransportSelectProps } from "./types";
import styles from "./carbon-calculator.module.css";

export function TransportSelect(props: TransportSelectProps) {
  const { options, selected, onSelect, getIcon, getLabel } = props;
  return (
    <SimpleGrid cols={3} spacing="xs">
      {options.map((item) => (
        <Card
          key={item.id}
          withBorder
          padding="xs"
          className={
            item.value && selected?.value && item.value === selected.value
              ? styles.activeTransportCard
              : styles.transportCard
          }
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
