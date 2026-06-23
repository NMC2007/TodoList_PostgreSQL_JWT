const FormField = ({
    label,
    name,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    ...rest
}) => {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium mb-1.5">
                {label}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`input-field ${error ? 'border-red-500 focus:border-red-500 ring-1 ring-red-500' : ''}`}
                {...rest}
            />
            {error && (
                <p className="text-red-500 text-xs mt-1.5">{error}</p>
            )}
        </div>
    );
};

export default FormField;
