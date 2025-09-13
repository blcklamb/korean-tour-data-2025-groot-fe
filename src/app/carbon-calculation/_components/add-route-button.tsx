import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";

interface AddRouteButtonProps {
  buttonText?: string;
  onClick?: () => void;
  className?: string;
}

export const AddRouteButton = (props: AddRouteButtonProps) => {
  const { onClick, buttonText = "경로 추가", className, ...rest } = props;
  return (
    <Button
      variant="secondary"
      onClick={onClick}
      className={className}
      {...rest}
    >
      <IconPlus className="w-4 h-4 mr-2" />
      {buttonText}
    </Button>
  );
};
