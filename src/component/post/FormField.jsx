const FormField = ({ label, type, name, value, placeholder, error, onChange, options }) => (
    <div className="mb-4">
      <label className="label">{label}</label>
      {type === 'select' ? (
        <select name={name} value={value} onChange={onChange} className="input-box mt-2">
          <option value="">Select category</option>
          {options?.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          name={name}
          value={type !== 'file' ? value : undefined}
          placeholder={placeholder}
          onChange={onChange}
          className="input-box mt-2"
        />
      )}
      {error && <p className="validateError">{error}</p>}
    </div>
  );
  
  export default FormField;
  