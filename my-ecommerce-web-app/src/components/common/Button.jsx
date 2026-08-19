const VARIANTS = {
  primary:
    "bg-indigo-600 text-white hover:bg-indigo-700 focus-visible:outline-indigo-600 disabled:bg-indigo-300",
  secondary:
    "bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 disabled:text-indigo-300 disabled:border-indigo-200",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus-visible:outline-red-600 disabled:bg-red-300",
  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100 disabled:text-gray-300",
  outline:
    "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:text-gray-300",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  loading = false,
  disabled = false,
  type = "button",
  icon: Icon,
  className = "",
  onClick,
  ...rest
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-medium
        transition-all duration-200 ease-out shadow-sm hover:shadow-md active:scale-[0.98]
        disabled:cursor-not-allowed disabled:shadow-none disabled:active:scale-100
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
        ${VARIANTS[variant]} ${SIZES[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...rest}
    >
      {loading ? (
        <svg
          className="h-4 w-4 animate-spin"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          />
        </svg>
      ) : (
        Icon && <Icon className="h-4 w-4" />
      )}
      {children}
    </button>
  );
};

export default Button;
