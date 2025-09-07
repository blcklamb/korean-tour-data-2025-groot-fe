import { Button, ButtonProps } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import styles from "./carbon-calculator.module.css";

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
      className={styles.addRouteButton}
      onClick={onClick}
      {...rest}
    >
      {buttonText}
    </Button>
  );
};
