import SharedInitiativeContent, {
  type InitiativeContentProps as SharedInitiativeContentProps,
} from "@/shared/components/InitiativeContent";

type InitiativeContentProps = Omit<
  SharedInitiativeContentProps,
  "image" | "imageAspectClass"
> & {
  image?: string;
};

export default function InitiativeContent({
  image = "/microfinanceinitiatives/why-microfinance-matters.png",
  ...props
}: InitiativeContentProps) {
  return (
    <SharedInitiativeContent
      {...props}
      image={image}
      imageAspectClass="aspect-[784/421]"
    />
  );
}
