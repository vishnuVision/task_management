import PropTypes from "prop-types";

function Input({label,type,name,placeholder,value,setValue}) {
  return (
    <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
        type={type}
        name={name}
        value={value}
        onChange={(e)=>setValue(e.target.value)}
        required
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        placeholder={placeholder}
        />
    </div>
  )
}

Input.propTypes = {
    label:PropTypes.string,
    type:PropTypes.string,    
    name:PropTypes.string,
    placeholder:PropTypes.string,
    value:PropTypes.string,
    setValue:PropTypes.func
}

export default Input
