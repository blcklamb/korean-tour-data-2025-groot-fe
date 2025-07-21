import Image from "next/image";

interface LogoIconProps extends React.HTMLAttributes<HTMLImageElement> {
  width?: number;
  height?: number;
}

const LogoIcon = (props: LogoIconProps) => {
  const { width = 32, height = 32, ...rest } = props;
  return (
    <Image
      src="/groot_logo.png"
      alt="Groot Logo"
      width={width}
      height={height}
      {...rest}
    />
  );
};

export default LogoIcon;
