import RegisterForm from '../components/RegisterForm';

export default function RegisterPage({ onRegister, onNavigate, ...props }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12">
      <RegisterForm onRegister={onRegister} onNavigate={onNavigate} />
    </div>
  );
}
