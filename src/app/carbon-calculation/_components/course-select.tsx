import { Card, Flex } from "@mantine/core";
import { CourseSelectProps } from "./types";

export function CourseSelect(props: CourseSelectProps) {
  const { options, selected, onSelect, getIcon, getLabel } = props;
  return (
    <Flex direction={"column"} gap="xs">
      {options.map((item) => (
        <Card
          key={item.id}
          withBorder
          padding={"4px"}
          className={
            selected?.value && item.value === selected.value
              ? "bg-green-100 border-green-600"
              : ""
          }
          onClick={() => onSelect(item)}
        >
          <Flex align="center" gap="xs" h={"100%"}>
            <span>{getIcon ? getIcon(item) : item.thumbnailUrl}</span>
            <span style={{ fontSize: "12px" }}>
              {getLabel ? getLabel(item) : item.title}
            </span>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
}
