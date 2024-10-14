import { useEffect, useState } from 'react';
import { Grid, Typography, Box } from '@mui/material/';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import axios from 'axios';
import TinderCard from 'react-tinder-card'
import FippableCard from './FippableCard';

import { MessageDialog, ConfirmationDialog } from '../../components/dialogs';
import { Tag } from '../../components/Tag';
import * as buffer from "buffer";
window.Buffer = buffer.Buffer;

var solanaWeb3 = require('@solana/web3.js');
var programID = new solanaWeb3.PublicKey("9uReBEtnYGYf1oUe4KGSt6kQhsqGE74i17NzRNEDLutn");
var pool = new solanaWeb3.PublicKey("3SdgUSptYW5NM4SFUYfJwV3awTG7hYJnc1T1yL519mEZ");
var tokenProgram = new solanaWeb3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");

function numToBytes(num, bytes){
    let output = [0, 0, 0, 0, 0, 0, 0, 0];
    for(let pow = 7; pow >= 0; pow--){
        output[pow] = Math.floor(num / 256**pow);
        num = num % 256**pow;
    }
    return output.slice(0, bytes);
}

function nameToBytes(name){
    let words = name.split(" ");
    if(words.length == 0){ //no name, not a player props bet
        return [0, 0, 0, 0];
    }
    else if(words.length == 1){//someone only has a first name
        return [name.charCodeAt(0), 0, 0, 0]
    }
    else{
        if(words.length > 2){ //last name with multiple words
            words[1] = words.slice(1).join(" ");
        }
        let output = [words[0].charCodeAt(0), words[1].charCodeAt(0), words[1].charCodeAt(1)]
        if(words[1].length == 2){ //2 letter last name
            output.push(0);
            return output;
        }
        else{
            output.push(words[1].charCodeAt(2));
            return output;
        }
    }
}
function stringToBytes(str){
    let output = [];
    for(let i = 0; i < str.length; i++){
        output.push(str.charCodeAt(i));
    }
    return new Uint8Array(output);
}

// function convertSide(sideName){
//     console.log(sideName, typeof sideName)
//     sideName = typeof sideName === "string" ? sideName.toLowerCase(): sideName;
// 	if ( sideName == 0) {
// 		return 0;
// 	} else if (sideName == 1 || sideName.includes("away") || sideName == 'lay' || sideName.substring(0, 5) == 'under') {
// 		return 1;
// 	}
// 	return -1;
// }

function instrData(idObj, betInfo){
    let {userStake, side, odds} = betInfo;
    //userStake and side need some preprocessing before 
    //betInfo contains userStake, side, odds, isLay
    let data = [];
    let ids = [
        {name: "sport", bytes: 1}, 
        {name: "league", bytes: 4}, 
        {name: "event", bytes: 8},
        {name: "period", bytes: 1},
        {name: "mkt", bytes: 2}
    ];
    for(let i = 0; i < ids.length; i++){
        let value = idObj[ids[i].name];
        data = data.concat(numToBytes(value, ids[i].bytes));
    }
    data = data.concat(nameToBytes(idObj.player));
    let stake0, stake1;
    if(side == 0){
        stake0 = numToBytes(userStake * 1000000);
        stake1 = numToBytes(Math.round(userStake * (odds - 1) * 1000000));
    }
    else{
        stake0 = numToBytes(Math.round(userStake * (odds - 1) * 1000000));
        stake1 = numToBytes(userStake * 1000000);
    }
    data = data.concat(stake0).concat(stake1);
    data.push(side);
    data.push(1); //to aggregate is always true when betting through site
    return data;
}


const PurebetSwipe = () => {

	var solanaWeb3 = require('@solana/web3.js');
	var mintPubkey = new solanaWeb3.PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

	const wallet = useWallet();

	const { connection } = useConnection();
	const [usdcBalance, setUSDCBalance] = useState(0);
	const [solBalance, setSolBalance] = useState(0);
	const [stake, setStake] = useState(10); //set default to 10 USDC
	const [ betTransactions, setBetTransactions ] = useState([]); 
	const [ events, setEvents ] = useState([]);
	const [ homeOnTopCard, setHomeOnTopCard ] = useState(true);
	const [ eventToBet, setEventToBet ] = useState(null);  //event id to bet

	const [ betDialog, setBetDialog ] = useState({ modal: null });

	const eventStr = event => { return event.event};

	const getPurebetId = (ev) => { return (ev.moneyline.event) };

	const getEvent = (purebetId) => { return events.find(ev => getPurebetId(ev) === purebetId) };

	const swiped = (direction, event) => {
		console.log('removing: ' + eventStr(event) + " from: " + direction);

		let eventId = getPurebetId(event);

		if (direction === "right" && eventId != eventToBet){
			setTimeout(()=>setEventToBet(eventId), 100);
		}
	}

	//this is a temp fix. It deletes the event Its not a bad thing. 
	//The scrolling still happens but is removed.
	//We should try to find the root cause but I am lost
	// const deleteCard = (delEv) => {
	// 	setEvents(events.filter((event) => getPurebetId(event) !== getPurebetId(delEv)));
	// }

	const outOfFrame = (event) => {
		console.log(eventStr(event) + ' left the screen!');
		//deleteCard(event); //part of temp fix
		setHomeOnTopCard(true);
	}

	useEffect(() => {
		if (wallet.publicKey) {
		  getUSDCBalance();
		  getSolBalance()
		}
	  }, [wallet.publicKey, connection]);
	

	async function getUSDCBalance() {
		var usdcAccRaw = await connection.getTokenAccountsByOwner(wallet.publicKey, { mint: mintPubkey });
		// var bal = usdcAccRaw.value[0].account.data.parsed.info.tokenAmount.uiAmount
		var usdcAcc = usdcAccRaw.value[0].pubkey;
		var balRaw = await connection.getTokenAccountBalance(usdcAcc);
		var bal = balRaw.value.uiAmount;
		setUSDCBalance(bal);
		setStake(Math.min(bal, stake));
	}

	async function getSolBalance(){
		const accInfo = await connection.getAccountInfo(wallet.publicKey);
		const sol = accInfo.lamports / solanaWeb3.LAMPORTS_PER_SOL;
		setSolBalance(sol);

		if (sol < 0.002){
			setTimeout(()=> setBetDialog({
				modal: (
				<MessageDialog
					open
					title="Low SOL Balance"
					text="You need more than 0.002 SOL balance in your wallet to bet. Please refill and try again."
					confirmButtonText="OK"
					onClose={()=>{ setBetDialog({modal: null}) }}
					onConfirm={()=>{ setBetDialog({modal: null}) }}
				/>
				),
			}));
		}
	}

	useEffect(() => {
		fetchEvents().catch(console.error);
	}, [wallet.publicKey]);


	useEffect(() => {
		if (eventToBet) {
			let event = getEvent(eventToBet);
			if (event) {
				confirmToPlaceBet(event);
			}
		}
	}, [eventToBet]);


	const confirmToPlaceBet = (event) => {
		//gtg
		{wallet.publicKey && solBalance > 0.002 ?
			setBetDialog({
				modal: (
				<ConfirmationDialog
					open
					data={event}
					title="Do you really want to place this bet?"
					body={ 
					<>
						<div style={{textAlign: "center"}}>
						for: <Tag key="for" label={homeOnTopCard ? event.homeTeam : event.awayTeam} color="primary" /><br/><br/>
						stake: <Tag key="stake" label={"" + stake + " USDC"} color="warning" /><br/><br/>
						odds: <Tag key="odd" label={ "" + (homeOnTopCard ? event.moneyline.home.highestOdds : event.moneyline.away.highestOdds) } color="true" /><br/>
						</div>
					</>
					}
					text= "overridden by body"
					confirmButtonText="Yes Place Bet"
					onClose={()=>{ setBetDialog({modal: null}) }}
					onConfirm={()=>{ handlePlaceBet(event) }}
					className="modal" // Apply the CSS class here
				/>
				),
			})
			: 
			(
				!wallet.publicKey ?
				//no wallet connected
				setBetDialog({
					modal: (
						<ConfirmationDialog
							open
							title="No wallet connected"
							text= "Connect a Solana wallet to place this"
							confirmButtonText="OK"
							hideCancelButton={true}
							onClose={()=>{ setBetDialog({modal: null}) }}
							onConfirm={()=>{ setBetDialog({modal: null}) }}
							className="modal" // Apply the CSS class here
						/>
						),
					})
				:
				//sol bal is low
				setBetDialog({
					modal: (
						<ConfirmationDialog
							open
							title="SOL balance low"
							text= "Your SOL balance is low. 0.002 SOL is required to place a bet. This is refunded once the match is over. Please add SOL to your wallet."
							confirmButtonText="OK"
							hideCancelButton={true}
							// onClose={()=>{ setBetDialog({modal: null}) }}
							onConfirm={()=>{ setBetDialog({modal: null}) }}
							className="modal" // Apply the CSS class here
						/>
						),
					})
			)
		}
	};
	
	const fetchEvents = async () => {

		// if (wallet.publicKey){
			let eventData = await axios.get("https://script.google.com/macros/s/AKfycbzOHT0zHPAt9m8qO4e65XBCOgCyvL5UlVEN6CpRwVziO0kEDo0OmQskdtWCYsbW2J1uUg/exec?url=http://3.97.10.72/events?sport=americanfootball");
			console.log(eventData.data.americanfootball["National Football League"])
			setEvents(eventData.data.americanfootball["National Football League"].sort((a,b)=>(b.startTime-a.startTime)));
			// setEvents(eventData.data.baseball.MLB.filter(event => event.moneyline));
		// }
		// else {
		// 	setEvents([]);
		// }
		setHomeOnTopCard(true);
		setEventToBet(null);
	};

	const handlePlaceBet = async (event) => {
		setBetDialog({modal: null})
		console.log('placing bet for ' + (homeOnTopCard ? event.homeTeam : event.awayTeam) + ' in event "' + eventStr(event) + '"');

		if (!process.env.REACT_APP_PLACE_REAL_BET || process.env.REACT_APP_PLACE_REAL_BET.toLowerCase()!=='true'){
			console.log("not in real betting mode")
			return null;
		}
		console.log(event)
		let idObj = {
			sport: event.moneyline.sportId,
			league: event.moneyline.league,
			event: event.moneyline.event,
			period: event.moneyline.period,
			mkt: event.moneyline.mkt,
			player: ""
		}
		console.log("is home card on top?", homeOnTopCard, "odds wwanted", (homeOnTopCard ? event.moneyline.home.highestOdds : event.moneyline.away.highestOdds))
		let betInfo = {
			userStake: stake,
			side: Number(!Boolean(homeOnTopCard)),
			odds: (homeOnTopCard ? event.moneyline.home.highestOdds : event.moneyline.away.highestOdds),
			isLay: false
		}
		var mintStr = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
		let payload = {
			"jsonrpc": "2.0",
			"id": Math.round(Math.random() * 100),
			"method": "getTokenAccountsByOwner",
			"params": [
				 wallet.publicKey.toBase58(),
				 {
					  "mint": mintStr
				 },
				 {
					  "encoding": "jsonParsed"
				 }
			]
		}
		let resp = await axios.post(process.env.REACT_APP_WALLET_ADAPTER_NETWORK, payload);
      let usdcATA = new solanaWeb3.PublicKey(resp?.data?.result?.value[0]?.pubkey)
		let addrs = {
			bettor: wallet.publicKey,
			usdcATA: usdcATA
		}
		let fixtures = {
			selectionName: (homeOnTopCard ? event.homeTeam : event.awayTeam),
			eventName: event.event
		}
		placeBet(
			idObj, betInfo, addrs, fixtures, connection,
			/// old
			// event.moneyline.id1,
			// event.moneyline.id2,
			// (homeOnTopCard ? "home" : "away"),
			// stake,
			// (homeOnTopCard ? event.moneyline.home.highestOdds : event.moneyline.away.highestOdds)
		)
		.then((result) => {
			console.log(result);

			setBetDialog({
				modal: (
				<MessageDialog
					open
					data={result}
					title="Bet Status"
					body={ 
					<>
						{
							result.error ?
							<div>
								Your bet placement failed due to the following reason:<br/><br/>
								{result.error.message}
							</div> :

							<div>
								Your bet has been placed with the following transaction signature:<br/><br/>
								<Tag key="txSignature" label={result.signature} color="success" /><br/>
							</div>
						}
						
					</>
					}
					text="overridden by body"
					confirmButtonText="OK"
					onClose={()=>{ setBetDialog({modal: null}) }}
					onConfirm={()=>{ setBetDialog({modal: null}) }}
				/>
				),
			});
		});
	};

	async function placeBet(idObj, betInfo, addrs, fixtures, connection) {

		let rentExemptVal = 1000000000 * 0.0018792;
		let seed = 'purebetv2' + Math.random() * 1000000000000;
		let newAcc = await solanaWeb3.PublicKey.createWithSeed(addrs.bettor, seed, programID);
		let instr = solanaWeb3.SystemProgram.createAccountWithSeed({
			 fromPubkey: addrs.bettor,
			 basePubkey: addrs.bettor,
			 seed: seed,
			 newAccountPubkey: newAcc,
			 lamports: rentExemptVal,
			 space: 142,
			 programId: programID,
		});
		
		let betInstr = new solanaWeb3.TransactionInstruction({
			 keys: [
				  {pubkey: newAcc, isSigner: false, isWritable: true },
				  {pubkey: tokenProgram, isSigner: false, isWritable: false},
				  {pubkey: addrs.usdcATA, isSigner: false, isWritable: true },
				  {pubkey: pool, isSigner: false, isWritable: true},
				  {pubkey: addrs.bettor, isSigner: true, isWritable: true }, //the bettor is guaranteed to be paying the usdc if this is running
				  {pubkey: addrs.bettor, isSigner: true, isWritable: true },
				  {pubkey: addrs.bettor, isSigner: true, isWritable: true }, //if this is running, the bettor is guaranteed to be the rent exemption payer
			 ],
			 programId: programID,
			 data: new Uint8Array(instrData(idObj, betInfo)),
		});
  
		let memo = new solanaWeb3.TransactionInstruction({
			 keys: [{ pubkey: addrs.bettor, isSigner: true, isWritable: true }],
			 data: stringToBytes(`{"bet": ${betInfo.userStake}, "at": ${betInfo.odds}, "on": "${fixtures.selectionName}", "in": "${fixtures.eventName}"}`),
			 programId: new solanaWeb3.PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr"),
		});
  
		
		let transaction = new solanaWeb3.Transaction();
		transaction.add(instr);
		transaction.add(betInstr);
		transaction.add(memo);
		transaction.feePayer = addrs.bettor;
		let blockInfo = await connection.getLatestBlockhash(); 
		transaction.recentBlockhash = blockInfo.blockhash;
		
		let signature = null;
		try {
			const {
				context: { slot: minContextSlot },
				value: { blockhash, lastValidBlockHeight },
			} = await connection.getLatestBlockhashAndContext();

			signature = await wallet.sendTransaction(transaction, connection, { minContextSlot });
			await connection.confirmTransaction({ signature });
		} 
		catch (error) {
			console.error(error);
			return { error }
		}
		
		const txResult = { signature };
		setBetTransactions([...betTransactions, txResult]);
		return txResult;
	}

	const noEventsForNow = ()=> { return Array.isArray(events) && events.length === 0 }

	const onStakeChanged = (event)=>{ 
		const stake = parseFloat(event.target.value);
		setStake(Math.min(Math.floor(usdcBalance*100)/100, stake));
	}

	
    return (
		<div>
			{ betDialog.modal }
			<Grid container direction="column">
				<Grid item component="header">
				</Grid>

				<Grid item component="main">
					<div style={{ height: 800, maxheight: 1200,  width: '95%', margin: 'auto', overflow: "hidden"}}>

						{ 
						// wallet.publicKey ? 
							( 
								<>
									<Typography sx={{ fontSize: '1rem', padding: 1 }}>Wallet USDC balance: {Math.floor(usdcBalance*100)/100}</Typography>

									<Typography sx={{ fontSize: '1rem', padding: 1 }} display="inline">Stake: </Typography>
									<input
										type="number" 
										// pattern="^\d*(\.\d{0,2})?$" 
										// inputmode="text"
										step="any"
										min="1.01"
										placeholder='10.00'
										style={{ width:"60px" }}
										value={stake}
										onChange={ onStakeChanged }
									/>
									<Typography sx={{ fontSize: '1rem', padding: 1 }} display="inline">USDC</Typography>
								</>
							)
							//  : 
							// <h3>Please connect your wallet to start</h3>
						}
						
						<br/><br/>
						<div style={{ marginTop: '30px' }}>
							<div className='swipeCardContainer'>
								{ noEventsForNow() ? 
									<Typography sx={{ fontSize: '0.8rem', padding: 1 }}>NFL Events for betting will be coming soon. Please check back a bit later.</Typography> : 
									<></>}
								{ 	<div id='swipeCardStack' lowSOL={ solBalance < 0.002 ? 'true' : 'false'}>{
										events.map((eventInfo) =>
											<TinderCard className='swipe' key={ getPurebetId(eventInfo) } 
												onCardLeftScreen={() => outOfFrame(eventInfo)}
												onSwipe={(dir) => swiped(dir, eventInfo)} 
												preventSwipe={['up', 'down']}>
													<FippableCard eventInfo={eventInfo} onFlipCard={setHomeOnTopCard} stake={stake}/>
											</TinderCard>)
										}
									</div>
								}
							</div>


						</div>
						<br/><br/>
						{ noEventsForNow() ? <></> : 
							<Typography sx={{ fontSize: '0.8rem', padding: 1 }}>
								{solBalance < 0.002 ? "Please refill SOL to continue" : "Swipe right to place bet, swipe left to skip"}</Typography>}
					</div>
				</Grid>
			</Grid>
			
		</div>
		
    );
};

export default PurebetSwipe;
