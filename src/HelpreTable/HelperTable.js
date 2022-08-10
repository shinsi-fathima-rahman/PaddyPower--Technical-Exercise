import { useState } from "react";
import { FiArrowUp } from "react-icons/fi";
import { FiArrowDown } from "react-icons/fi";
import Table from 'react-bootstrap/Table';
import './HelperTable.css';
import EmptyState from "../EmptyState/EmptyState.js";

const HelperTable = ({ columnHeaders, tableHeader, tableData, onCellClick }) => {
    const [sortField, setSortField] = useState("");
    const [order, setOrder] = useState("asc");
    const [internalTableInfo, setInternalTableInfo] = useState(tableData);
    const [prevValue, setPrevValue] = useState('');
    //TODO : extract sort logic into a reusable hook.
    //TODO : add reset attribute to reset the table when needed?

    //update the internal state when prop changes.
    if (prevValue !== tableData) {
        setPrevValue(tableData);
        setInternalTableInfo(tableData);
        setOrder('asc');
        setSortField('');
    }

    const handleSort = (field) => {
        const sortOrder = field === sortField && order === "asc" ? "desc" : "asc";
        setSortField(field);
        setOrder(sortOrder);

        const sorted = [...internalTableInfo].sort((a, b) => {
            //handle columns with null values
            if (a[field] === null) return 1;
            if (b[field] === null) return -1;
            if (a[field] === null && b[sortField] === null) return 0;
            return (
                a[field].toString().localeCompare(b[field].toString(), "en", {
                    numeric: true,
                }) * (sortOrder === "asc" ? 1 : -1)
            );
        });
        setInternalTableInfo(sorted);
    };
    const handleButtonClick = (data) => {
        onCellClick(data);
    }
    return (
        <>
            <div className="helper-table__header" data-testid='header'>{tableHeader}</div>
            {internalTableInfo.length ? <Table className="helper-table" striped bordered hover>
                <thead>
                    <tr>
                        {columnHeaders.map((element) => {
                            const arrowDirection = element.isSortable
                                ? sortField === element.identifier && order === "asc"
                                    ? <FiArrowDown />
                                    : sortField === element.identifier && order === "desc"
                                        ? <FiArrowUp />
                                        : <FiArrowUp />
                                : "";
                            return (
                                <th data-testid='columnHeader'
                                    key={element.identifier}
                                    onClick={
                                        element.isSortable
                                            ? () => handleSort(element.identifier)
                                            : null
                                    }
                                >
                                    <div data-testid="column">{element.label}{element.isSortable? arrowDirection: null}</div>
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody>
                    {internalTableInfo.map((data) => {
                        return (
                            <tr key={data.id}>
                                {columnHeaders.map((element) => {
                                    const tData = data[element.identifier]
                                        ? data[element.identifier]
                                        : "—";
                                    return <td data-testid='value' key={element.identifier}>{element.isClickable ? <button data-testid='button' onClick={() => { handleButtonClick(data.id) }}>{tData}</button> : tData}</td>;
                                })}
                            </tr>
                        );
                    })} 
                </tbody>
            </Table> : <EmptyState/>}
        </>
    );
};

export default HelperTable;
