import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import Canvas from "./component/Canvas";
import ButtonList from "./component/ButtonList";
import styled from "styled-components";

const CenterBox: any = styled.section`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	margin-top: 4rem;
`;

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
	"https://s3.us-west-2.amazonaws.com/secure.notion-static.com/ada77c5d-fd46-402f-a014-0a0bd8052104/data.json?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAT73L2G45O3KS52Y5%2F20201116%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20201116T012545Z&X-Amz-Expires=86400&X-Amz-Signature=e11a28c0c4aedeb3a18e52589fd8290dff981d2f3baf62d4da93feb585975105&X-Amz-SignedHeaders=host&response-content-disposition=filename%20%3D%22data.json%22";

function App() {
	const [prevData, setData] = useState(initData);
	useEffect(() => {
		if (prevData.length === 0) {
			const fetchdata = async () => {
				await axios.get(url).then((res) => {
					setData(res.data.dataset);
				});
			};
			fetchdata();
		}
	}, [prevData]);

	return (
		<CenterBox>
			{prevData.length === 0 ? <></> : <Canvas prevData={prevData}></Canvas>}
			{/* <Canvas prevData={prevData}></Canvas> */}
			<ButtonList></ButtonList>
		</CenterBox>
	);
}

export default App;
