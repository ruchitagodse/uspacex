import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode.react';

const QRCodeComponent = ({ value, size }) => {
    const [isBrowser, setIsBrowser] = useState(false);

    useEffect(() => {
        setIsBrowser(true); // This will run only on the client side
    }, []);

    return (
        <>
            {isBrowser ? <QRCode value={value} size={size} /> : null}
        </>
    );
};

export default QRCodeComponent;
