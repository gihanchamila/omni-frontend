import React from 'react'
import { useEffect, useCallback } from 'react'

const useClickOutside = (ref, callback) => {

    const handleClickOutside = useCallback((e) => {
        if(ref.current && !ref.current.contains(e.target)){
            callback()
        }
    }, [ref, callback])
 
    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [handleClickOutside]);
}

export default useClickOutside