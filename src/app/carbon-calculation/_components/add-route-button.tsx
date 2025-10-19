import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";

interface AddRouteButtonProps {
  buttonText?: string;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
}

export const AddRouteButton = (props: AddRouteButtonProps) => {
  const { buttonText = "경로 추가", ...rest } = props;
  return (
    <Button variant="default" {...rest}>
      <IconPlus className="w-4 h-4 mr-2" />
      {buttonText}
    </Button>
  );
};
