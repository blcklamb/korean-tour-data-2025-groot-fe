import { Card, Flex, UnstyledButton } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { RouteItemProps } from "./types";

export const RouteItem = (props: RouteItemProps) => {
  const {
    departureCityName,
    arrivalCityName,
    courseName,
    transportIcon,
    onDelete,
  } = props;
  return (
    <Card padding="xs" className="bg-slate-50">
      <Flex justify={"space-between"} align="center">
        <Flex direction={"column"} gap="xs" align={"center"}>
          <Flex gap="xs" align={"center"}>
            <span style={{ fontSize: "20px" }}>{transportIcon}</span>
            {!courseName ? (
              <Flex gap="xs">
                <span>{departureCityName}</span>→<span>{arrivalCityName}</span>
              </Flex>
            ) : (
              <span>{courseName}</span>
            )}
          </Flex>
        </Flex>
        <UnstyledButton onClick={onDelete}>
          <IconX size={16} color="red" />
        </UnstyledButton>
      </Flex>
    </Card>
  );
};
