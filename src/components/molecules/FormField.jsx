import Input from '@/components/atoms/Input';

const FormField = ({ label, error, children, className = '' }) => {
  return (
    <div className={`space-y-1 ${className}`}>
      {children || <Input label={label} error={error} />}
    </div>
  );
};

export default FormField;