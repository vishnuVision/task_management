import PropTypes from "prop-types"

function FileInput({label,name,placeholder,setValue}) {
  return (
    <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
        type="file"
        name={name}
        onChange={(e)=>setValue(e.target.files[0])}
        required
        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        placeholder={placeholder}
        />
    </div>
  )
}

FileInput.propTypes = {
    label:PropTypes.string,
    name:PropTypes.string,
    placeholder:PropTypes.string,
    setValue:PropTypes.func
}

export default FileInput
