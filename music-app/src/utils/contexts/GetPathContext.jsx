import { Children, createContext, useState } from "react";
import PropTypes from "prop-types";


const GetPathContext = createContext();

const GetPathProvider = ({ Children }) => {
    const [ path, setPath ] = useState("");

    const loadPath = (currentPath) => {
        setPath(currentPath);
    }
    return(
        <GetPathContext.Provider value={{ path, loadPath }}>
            {Children}
        </GetPathContext.Provider>
    )
}

GetPathProvider.propTypes = {
    Children: PropTypes.node.isRequired
}

export {GetPathContext, GetPathProvider};