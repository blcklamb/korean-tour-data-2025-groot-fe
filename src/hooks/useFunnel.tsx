import { ReactNode, useState, ReactElement } from "react";

type StepProps = {
  name: string;
  children: ReactNode;
};

function Step({ children }: StepProps): ReactElement {
  return <>{children}</>;
}

type FunnelProps<T> = {
  step: T;
  children: ReactNode;
};

function Funnel<T>({ step, children }: FunnelProps<T>): ReactElement {
  const steps = Array.isArray(children)
    ? (children as ReactElement<StepProps>[])
    : [children as ReactElement<StepProps>];
  const targetStep = steps.find((child) => child.props.name === step);
  return <>{targetStep}</>;
}

export function useFunnel<T>(defaultStep: T) {
  const [step, setStep] = useState<T>(defaultStep);
  return [
    (props: { children: ReactNode }) => <Funnel step={step} {...props} />,
    Step,
    step,
    setStep,
  ] as const;
}
