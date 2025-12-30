import ContactForm from '../components/ContactForm';
import { Header } from '../components/Header';

export default function ContactPage({ ...props }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header {...props} />
      <main className="py-12">
        <ContactForm />
      </main>
    </div>
  );
}
