import React from 'react'
import commonApi from '../../../api/common';

const useDocument = ({folderId}) => {

    const getFolderDocuments = async () => {
        try {
          const response = await commonApi({
            action: 'getFolderDocuments',
            parameters:[folderId]
          });
          console.log("🚀 ~ getFolderDocuments ~ response:", response)
        } catch (error) {
          console.error('Payment Methods', error);
        }
      };
    
  return {
    getFolderDocuments
  }
}

export default useDocument