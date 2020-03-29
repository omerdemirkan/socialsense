import React, {useEffect} from 'react';

export default function ScrollUpOnMount() {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, []);

    return null;
}
