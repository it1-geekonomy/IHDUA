import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";

export default function ContactSection() {
  return (
    <section className="w-full bg-white px-6 py-8 lg:px-10 lg:py-14 2xl:px-40">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-1 xl:gap-15">
        <ContactInfo />
        <ContactForm />
      </div>
    </section>
  );
}