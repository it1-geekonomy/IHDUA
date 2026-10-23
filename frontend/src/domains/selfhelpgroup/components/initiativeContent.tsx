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
  image = "/selfhelpgroup/collective.png",
  ...props
}: InitiativeContentProps) {
  return (
    <SharedInitiativeContent
      {...props}
      image={image}
      imageAspectClass="aspect-[582/415]"
    />
  );
}
