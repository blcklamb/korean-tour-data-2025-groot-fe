import { Card, Flex, UnstyledButton } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import dayjs from "dayjs";

interface AccomodationItemProps {
  checkInDate: string;
  checkOutDate: string;
  typeLabel: string;
  onDelete: () => void;
}

export const AccomodationItem = ({
  checkInDate,
  checkOutDate,
  typeLabel,
  onDelete,
}: AccomodationItemProps) => {
  return (
    <Card padding="xs" className="bg-slate-50">
      <Flex justify="space-between" align="center">
        <Flex direction="column" gap="xs">
          <Flex gap="xs">
            <span>{dayjs(checkInDate).format("YYYY-MM-DD")}</span>~
            <span>{dayjs(checkOutDate).format("YYYY-MM-DD")}</span>
          </Flex>
          <span style={{ fontWeight: 600 }}>{typeLabel}</span>
        </Flex>
        <UnstyledButton onClick={onDelete}>
          <IconX size={16} color="red" />
        </UnstyledButton>
      </Flex>
    </Card>
  );
};
