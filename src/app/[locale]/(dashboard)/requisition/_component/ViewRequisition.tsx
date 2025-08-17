import { useGetSinglerequistionQuery } from '@/redux/api/requisitionApi';
import React from 'react';

const ViewRequisition = ({rowData}:{rowData:any}) => {
    const {data,isLoading}=useGetSinglerequistionQuery({
        id:rowData?.id
    })

    if(isLoading){
        return
    }
    console.log(data,"data");
    return (
        <div>
            <h1>View requsition</h1>
        </div>
    );
};

export default ViewRequisition;