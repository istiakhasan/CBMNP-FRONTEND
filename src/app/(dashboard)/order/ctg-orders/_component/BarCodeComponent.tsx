"use client"
import React from 'react'
import { useBarcode } from "next-barcode";

interface BarCodeProps {
	value: string
}
const BarCodeComponent:React.FC<BarCodeProps> = ({value}) => {
	const { inputRef } = useBarcode({
		value: value
		// options: {
		// 	background: "#ccffff",
		// },
	});
	return (
		<div className="p-4">
			<canvas ref={inputRef} />
		</div>
	);
};

export default BarCodeComponent;