const EmptyState = ({
  icon: Icon,
  title = "Nothing here yet",
  description,
  action,
}) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/60 px-6 py-16 text-center">
    {Icon && (
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
        <Icon className="h-8 w-8 text-indigo-400" />
      </div>
    )}
    <h3 className="text-base font-semibold text-gray-800">{title}</h3>
    {description && (
      <p className="mt-1.5 max-w-sm text-sm text-gray-500">{description}</p>
    )}
    {action && <div className="mt-6">{action}</div>}
  </div>
);

export default EmptyState;
