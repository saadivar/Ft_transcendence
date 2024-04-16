
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './Match.css';
import image2 from '../../../assets/theFlash.jpg';

// Import necessary Swiper modules
import { Navigation, Pagination, Scrollbar,Autoplay } from 'swiper/modules';

const Match = ({ match }) => {
    return (
        <div className="match">
            <div className="card">
                <div className="my-content">
                    <img className="my-card-img" src={match.player1.image} alt={match.player1.name} />
                    <p className="my-card-res">{match.player1.result}</p>
                </div>
                <div className="component-content">
                    <img className="com-card-img" src={match.player2.image} alt={match.player2.name} />
                    <p className="com-card-res">{match.player2.result}</p>
                </div>
            </div>
        </div>
    );
};

const ListMatch = () => {
    const matches = [
        {
            player1: { name: 'Player 1', image: image2, result: '0' },
            player2: { name: 'Player 2', image: image2, result: '10' },
            result: '1'
        },
        {
            player1: { name: 'Player 1', image: image2, result: '1' },
            player2: { name: 'Player 2', image: image2, result: '22' },
            result: '1'
        },
        {
            player1: { name: 'Player 1', image: image2, result: '5' },
            player2: { name: 'Player 2', image: image2, result: '8' },
            result: '1'
        },
        {
            player1: { name: 'Player 1', image: image2, result: '6' },
            player2: { name: 'Player 2', image: image2, result: '17' },
            result: '1'
        },
        // Add more matches as needed
    ];

    return (
        <div className="matches-list-container">
            <div className="title-history">
                <p>List Matches</p>
            </div>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, Autoplay]}
                spaceBetween={15}
                slidesPerView={3}
                navigation
                autoplay={{ delay: 1500, disableOnInteraction: false }}
                loop={true}
                className="swiper-container"
            >
                {matches.map((match, index) => (
                    <SwiperSlide key={index}>
                        <Match match={match} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ListMatch;
