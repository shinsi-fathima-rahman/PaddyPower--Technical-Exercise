import './HelperDropdown.css';
const HelperDropdown = ({ options, onSelection, name }) => {
    const handleChange = (event, name) => {
        const selectedIndex = event.target.options.selectedIndex;
        const key = event.target.options[selectedIndex].value;
        onSelection(key, name);
    }
    return (
        <>
            <label data-testid='label' htmlFor={name}>Choose a {name}:</label>
            <select className="dropdown" data-testid="dropdown" name={name} id="leagues" onChange={(event) => { handleChange(event, name) }}>
                <option data-testid="default" hidden>Choose an Option</option>
                {options && options.map(option => (<option data-testid='option' value={option.id} key={option.id}>{option.name}</option>))}
            </select>
        </>

    );
};

export default HelperDropdown;
