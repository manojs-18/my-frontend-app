const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  icon: Icon,
  required = false,
  className = "",
  ...rest
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        )}
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-lg border bg-white text-sm text-gray-900 shadow-sm
            placeholder:text-gray-400 transition-colors
            focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500
            ${Icon ? "pl-9" : "pl-3.5"} pr-3.5 py-2.5
            ${error ? "border-red-400 focus:ring-red-500/30 focus:border-red-500" : "border-gray-300"}`}
          {...rest}
        />
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
