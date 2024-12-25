import React from 'react';
import Header from './Header';

const LayoutNonFooter = ({ children }) => {
    return (
        <div>
            <Header />
            <main>{children}</main>
        </div>
    );
};

export default LayoutNonFooter;