import { useState } from 'react';
import { AppIconButton } from '../../components';
import { Tag } from '../../components/Tag';

  

const FippableCard = ( { eventInfo, onFlipCard, stake } ) => {

	const [showFront, setShowFront] = useState(true);

	const flipHome = (betForHome) => {
		setShowFront(betForHome);
		onFlipCard(betForHome)
	}

    return (
		<div style={{textAlign: 'center'}} className="flip-card">

			<div className= { "flip-card-inner " + (showFront? "flip-card-inner-front" : "flip-card-inner-back") }>

				<div style={{ backgroundImage: 'url(./img/sports/bg-combat.png)', backgroundSize: '100px'}} 
					className="flip-card-front swipeCard">
					<h3 style={{color: 'black', paddingTop: '15px'}}>{eventInfo.event}</h3>
					<div style={{ justifyContent: 'center', alignItems: 'center', paddingTop: '30px'}}>
						<h3 style={{color: 'black'}}>{eventInfo.homeTeam}</h3>
						Stake: <Tag key="stake" label={ ""+stake + " USDC" } color="false" /><br/>
						Odd: <Tag key="odd" label={ "" + eventInfo.moneyline.home.highestOdds } color="true" />
						<br/><br/><br/>
						<AppIconButton icon="flipToBack" color="secondary" title={ "Flip to " + eventInfo.awayTeam } onClick={()=>flipHome(false)}/>
					</div>
				</div>

				<div style={{ backgroundImage: 'url(./img/sports/bg-combat.png)', backgroundSize: '100px'}} 
					className="flip-card-back swipeCard">
					<h3 style={{color: 'black', paddingTop: '15px'}}>{eventInfo.event}</h3>
					<div style={{ justifyContent: 'center', alignItems: 'center', paddingTop: '50px'}}>
						<h3 style={{color: 'black'}}>{eventInfo.awayTeam}</h3>
						Stake: <Tag key="stake" label={ ""+stake + " USDC" } color="false" /><br/>
						Odd: <Tag key="odd" label={ "" + eventInfo.moneyline.away.highestOdds } color="true" />
						<br/><br/><br/>
						<AppIconButton icon="flipToFront" color="secondary" title={ "Flip to " + eventInfo.homeTeam } onClick={()=>flipHome(true)}/>
					</div>
				</div>

			</div>
		</div>
    );
};

export default FippableCard;