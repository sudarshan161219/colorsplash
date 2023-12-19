import { useEffect } from 'react';

const UsePageTitle = (title) => {
    useEffect(() => {
        document.title = title;

        return () => {
            document.title = 'Color Splash - Elevate Your Style'; 
        };
    }, [title]);
}

export default UsePageTitle