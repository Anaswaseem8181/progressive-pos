export const SelectField = ({ label, name, register, errors, options }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <select
                {...register(name)}
                className={`w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[name] ? "border-red-500" : "border-gray-300"
                    }`}
            >
                <option value="">Select Category</option>
                {options.map((opt, i) => (
                    <option key={i} value={opt}>
                        {opt}
                    </option>
                ))}
            </select>

            {errors[name] && (
                <p className="text-red-500 text-sm mt-1">
                    {errors[name].message}
                </p>
            )}
        </div>
    );
};
