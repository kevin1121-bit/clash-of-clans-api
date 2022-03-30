interface IProps {
  image: string;
  name: string;
  warFrequency: string;
  members: number;
  warWins: number;
  clanPoints: number;
}

function Card(props: IProps) {
  const { image, name, warFrequency, members, warWins, clanPoints } = props;
  return (
    <div className='card mb-5'>
      <img src={image} className='card-img-top' alt='...' />
      <div className='card-body'>
        <h5 className='card-title'>{name}</h5>
      </div>
      <div className='card-footer'>
        <small className='text-muted'>{`War Frequency: ${warFrequency}`}</small>
        <br />
        <small className='text-muted'>{`Members: ${members}`}</small>
        <br />
        <small className='text-muted'>{`War Wins: ${warWins}`}</small>
        <br />
        <small className='text-muted'>{`Clan points: ${clanPoints}`}</small>
      </div>
    </div>
  );
}

export default Card;
