import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import * as d3 from "d3";

// interface Dataset {
// 	dataset: {}[];
// }

function App() {
	const [data, setData] = useState({ dataset: [] });
	const url =
		"https://s3.us-west-2.amazonaws.com/secure.notion-static.com/1da547de-1912-4183-9f35-27857575d2b5/data1.json?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20201116%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20201116T013137Z&X-Amz-Expires=86400&X-Amz-Signature=6ffe89749fd554f5ef1e30918227d5bda3e8df3759d2433743e7758284c37fb4&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22data-1.json%22";
	useEffect(() => {
		const fetchdata = async () => {
			await axios.get(url).then((res) => {
				setData(res.data);
			});
		};
		fetchdata();
	}, []);
	console.log(data);
	return (
		<>
			{data.dataset.map((item: any, index) => (
				<div key={index}>
					{item.BlackScr}
					{item.CO2air}
					{item.EC_drain_PC}
					{item.EC_slab1}
					{item.EC_slab2}
					{item.EnScr}
					{item.HumDef}
					{item.Iglob}
					{item.PipeGrow}
					{item.PipeLow}
					{item.RadSum}
					{item.Rhair}
					{item.Tair}
					{item.Tout}
					{item.WC_slab1}
					{item.WC_slab2}
					{item.time}
				</div>
			))}
		</>
	);
}

export default App;
