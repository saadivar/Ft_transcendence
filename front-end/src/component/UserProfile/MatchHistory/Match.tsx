
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
import { AnyPixelFormat } from 'three';
interface PropsMatch{
    match : any;
}
const Match = ({ match } : PropsMatch) => {
    return (
        <div className="match">
            <div className="card">
                <div className="my-content">
                    <img className="my-card-img" src={match.player1.avatar} alt={match.player1.login} />
                    <p className="my-card-res">{match.score1}</p>
                </div>
                <div className="component-content">
                    <img className="com-card-img" src={match.player2.avatar} alt={match.player2.login} />
                    <p className="com-card-res">{match.score2}</p>
                </div>
            </div>
        </div>
    );
};
interface Props{
    profile : any;
}
const ListMatch = ({profile} : Props) => {

    return (
        <div className="matches-list-container">
            <div className="title-history">
                <p>List Matches</p>
            </div>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, Autoplay]}
                spaceBetween={15}
                slidesPerView={3}
                slidesPerGroup={1}
                navigation
                autoplay={{ delay: 1500, disableOnInteraction: false }}
                loop={true}
                className="swiper-container"
            >
                {profile.games.map((match: any, index : any) => (
                    <SwiperSlide key={index}>
                        <Match match={match} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ListMatch;
