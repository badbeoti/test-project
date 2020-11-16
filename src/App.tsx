import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

interface DataFace {
	BlackScr: number;
	CO2air: number;
	EC_drain_PC: number;
	EC_slab1: number;
	EC_slab2: number;
	EnScr: number;
	HumDef: number;
	Iglob: number;
	PipeGrow: number;
	PipeLow: number;
	RadSum: number;
	Rhair: number;
	Tair: number;
	Tout: number;
	WC_slab1: number;
	WC_slab2: number;
	time: string;
}

const initData: DataFace[] = [];

const url =
	"https://s3.us-west-2.amazonaws.com/secure.notion-static.com/1da547de-1912-4183-9f35-27857575d2b5/data1.json?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20201116%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20201116T013137Z&X-Amz-Expires=86400&X-Amz-Signature=6ffe89749fd554f5ef1e30918227d5bda3e8df3759d2433743e7758284c37fb4&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22data-1.json%22";

function App() {
	const [data, setData] = useState(initData);
	useEffect(() => {
		const fetchdata = async () => {
			await axios.get(url).then((res) => {
				setData(data.concat(res.data.dataset));
			});
		};
		fetchdata();
	}, []);
	console.log(data);

	return <section></section>;
}

export default App;
