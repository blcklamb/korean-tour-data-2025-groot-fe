import { Button, ButtonProps } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";

interface AddRouteButtonProps extends ButtonProps {
  buttonText?: string;
  onClick?: () => void;
}

export const AddRouteButton = (props: AddRouteButtonProps) => {
  const { onClick, buttonText = "경로 추가", ...rest } = props;
  return (
    <Button
      variant="subtle"
      leftSection={<IconPlus />}
      onClick={onClick}
      {...rest}
    >
      {buttonText}
    </Button>
  );
};
