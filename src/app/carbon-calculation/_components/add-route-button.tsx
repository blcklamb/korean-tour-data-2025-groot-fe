import { Button, ButtonProps } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import styles from "./carbon-calculator.module.css";

interface AddRouteButtonProps extends ButtonProps {
  onClick?: () => void;
}

export const AddRouteButton = (props: AddRouteButtonProps) => {
  const { onClick, ...rest } = props;
  return (
    <Button
      variant="subtle"
      leftSection={<IconPlus />}
      className={styles.addRouteButton}
      onClick={onClick}
      {...rest}
    >
      경로 추가
    </Button>
  );
};
