import { useEffect, useState } from 'react';
import { Grid, Typography, Box } from '@mui/material/';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import axios from 'axios';
import TinderCard from 'react-tinder-card'
import FippableCard from './FippableCard';

import { MessageDialog, ConfirmationDialog } from '../../components/dialogs';
import { Tag } from '../../components/Tag';


const PurebetSwipe = () => {

	var solanaWeb3 = require('@solana/web3.js');
	var mintPubkey = new solanaWeb3.PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

	const wallet = useWallet();

	const { connection } = useConnection();
	const [usdcBalance, setUSDCBalance] = useState(0);
	const [stake, setStake] = useState(1);
	const [ betTransactions, setBetTransactions ] = useState([]); 
	const [ events, setEvents ] = useState([]);
	const [ homeOnTopCard, setHomeOnTopCard ] = useState(true);
	const [ eventToBet, setEventToBet ] = useState(null);  //event id to bet

	const [ betDialog, setBetDialog ] = useState({ modal: null });

	const eventStr = event => { return event.event + " with id1=" + event.moneyline.id1 + " id2=" + event.moneyline.id2 ; };

	const getPurebetId = (ev) => { return (ev.moneyline.id1 * 256 + ev.moneyline.id2) };

	const getEvent = (purebetId) => { return events.find(ev => getPurebetId(ev) === purebetId) };

	const swiped = (direction, event) => {
		console.log('removing: ' + eventStr(event) + " from: " + direction);

		let eventId = getPurebetId(event);

		if (direction === "right" && eventId != eventToBet){
			setTimeout(()=>setEventToBet(eventId), 100);
		}
	}

	const outOfFrame = (event) => {
		console.log(eventStr(event) + ' left the screen!');
		setHomeOnTopCard(true);
	}

	useEffect(() => {
		if (wallet.publicKey) {
		  getUSDCBalance();
		}
	  }, [wallet.publicKey, connection]);
	

	async function getUSDCBalance() {
		var usdcAccRaw = await connection.getTokenAccountsByOwner(wallet.publicKey, { mint: mintPubkey });
		// var bal = usdcAccRaw.value[0].account.data.parsed.info.tokenAmount.uiAmount
		var usdcAcc = usdcAccRaw.value[0].pubkey;
		var balRaw = await connection.getTokenAccountBalance(usdcAcc);
		var bal = balRaw.value.uiAmount;
		
		setUSDCBalance(bal);
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
					odd: <Tag key="odd" label={ "" + (homeOnTopCard ? event.moneyline.home.highestOdds : event.moneyline.away.highestOdds) } color="true" /><br/>
					</div>
				</>
				}
				text= "overridden by body"
				confirmButtonText="Yes Place Bet"
				onClose={()=>{ setBetDialog({modal: null}) }}
				onConfirm={()=>{ handlePlaceBet(event) }}
			/>
			),
		});
	};
	
	const fetchEvents = async () => {
		if (wallet.publicKey){
			let eventData = await axios.get("https://api.purebet.io/pbapi?sport=combat");
			setEvents(eventData.data.combat.UFC.filter(event => event.moneyline));
		}
		else {
			setEvents([]);
		}
		setHomeOnTopCard(true);
		setEventToBet(null);
	};

	const handlePlaceBet = (event) => {
		setBetDialog({modal: null})
		console.log('placing bet for ' + (homeOnTopCard ? event.homeTeam : event.awayTeam) + ' in event "' + eventStr(event) + '"');

		if (!process.env.REACT_APP_PLACE_REAL_BET){
			return null;
		}

		placeBet(
			event.moneyline.id1,
			event.moneyline.id2,
			(homeOnTopCard ? "home" : "away"),
			stake,
			(homeOnTopCard ? event.moneyline.home.highestOdds : event.moneyline.away.highestOdds)
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
	

	async function placeBet(id1, id2, side, userStake, userOdds) {

		var wireRaw = await axios.get("https://api.purebet.io/bets/betBuilder" + 
			"?id1=" + id1 + 
			"&id2=" + id2 + 
			"&side=" + side + 
			"&stake=" + userStake + 
			"&odds=" + userOdds + 
			"&bettorAddr=" + wallet.publicKey.toBase58()
		);
		var wire = wireRaw.data.body;
		var betAccs = wireRaw.data.betAccs;
		var transaction = solanaWeb3.Transaction.from(wire);
		
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
		
		const txResult = { signature, betAccs };
		setBetTransactions([...betTransactions, txResult]);
		return txResult;
	}

	
    return (
		<div>
			{ betDialog.modal }
			<Grid container direction="column">
				<Grid item component="header">
				</Grid>

				<Grid item component="main">
					<div style={{ height: 800, maxheight: 1200,  width: '95%', margin: 'auto' }}>

						{ wallet.publicKey ? 
							( 
								<>
									<Typography sx={{ fontSize: '1rem', padding: 1 }}>Wallet USDC balance: {usdcBalance}</Typography>

									<Typography sx={{ fontSize: '1rem', padding: 1 }} display="inline">Stack: </Typography>
									<input
										type="number"
										placeholder="0.00"
										style={{ width:"60px" }}
										value={stake}
										onChange={(event)=>{ setStake(event.target.value) }}
									/>
									<Typography sx={{ fontSize: '1rem', padding: 1 }} display="inline">USDC</Typography>
								</>
							)
							 : 
							<h3>Please connect your wallet to start</h3>
						}
						
						<br/><br/>
						<div style={{ marginTop: '30px' }}>
							<div className='swipeCardContainer'>
								{events.map((eventInfo) =>
									<TinderCard className='swipe' key={ getPurebetId(eventInfo) } 
										onSwipe={(dir) => swiped(dir, eventInfo)} 
										onCardLeftScreen={() => outOfFrame(eventInfo)}
										preventSwipe={['up', 'down']}>
											<FippableCard eventInfo={eventInfo} onFlipCard={setHomeOnTopCard} stake={stake}/>
									</TinderCard>
								)}
							</div>
						</div>
						<br/><br/>
						<Typography sx={{ fontSize: '0.8rem', padding: 1 }}>Swipe right to place bet, swipe left to skip</Typography>
					</div>
				</Grid>
			</Grid>
			
		</div>
		
    );
};

export default PurebetSwipe;