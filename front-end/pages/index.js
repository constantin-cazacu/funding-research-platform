import Navbar from "../components/navbar";
import CustomCard from "../components/customCard";
import HorizontalCard from "../components/horizontalCard";
import FeaturedCards from "../components/featuredCards";
import CardCarousel from "../components/cardCarousel";

const cardData = [
    {
        title: "Card 1",
        description: "This is the description for Card 1",
        image: "https://lumiere-a.akamaihd.net/v1/images/the-mandalorian-ch-19-mando-download-03_9747c4d3.jpeg",
        author: "John Doe",
        requiredFunds: "$1000",
    },
    {
        title: "Card 2",
        description: "This is the description for Card 2",
        image: "https://source.unsplash.com/random",
        author: "Jane Doe",
        requiredFunds: "$2000",
    },
    {
        title: "Card 3",
        description: "This is the description for Card 3",
        image: "https://source.unsplash.com/random",
        author: "Bob Smith",
        requiredFunds: "$500",
    },
];

function Home() {
    return (
        <>
            <Navbar></Navbar>,
            <CustomCard
                image="https://lumiere-a.akamaihd.net/v1/images/the-mandalorian-ch-19-mando-download-03_9747c4d3.jpeg"
                title="Example CustomCard"
                requiredFunds={5000}></CustomCard>
            <HorizontalCard
                image="https://lumiere-a.akamaihd.net/v1/images/the-mandalorian-ch-19-mando-download-03_9747c4d3.jpeg"
                title="Example CustomCard"
                requiredFunds={5000}></HorizontalCard>
            <CardCarousel data={cardData} />
        </>

    )
}

export default Home