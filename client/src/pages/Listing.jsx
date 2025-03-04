import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
// import 'swiper/swiper-bundle.css';
import "swiper/css/bundle";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(false);

        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();

        if (!res.ok || data.success === false) {
          throw new Error("Failed to fetch listing");
        }

        setListing(data);
      } catch (error) {
        console.error("Error fetching listing:", error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]); // Added dependency array to prevent infinite calls

  return (
    <div className="p-6">
      {loading ? (
        <div className="flex flex-col items-center justify-center py-6">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-500 mb-2"></div>
          <p className="text-gray-500 text-lg">Loading...</p>
        </div>
      ) : error ? (
        <p className="text-red-500 text-lg">
          Error loading listing. Try again later.
        </p>
      ) : listing ? (
        <h2 className="text-xl font-semibold">
          {
            <Swiper navigation>
              {listing.imageUrls.map((url) => (<SwiperSlide key={url}>
                <div className="h-[500px]" style={{background:`url(${url}) center no-repeat `, backgroundSize:'cover'}}></div>
              </SwiperSlide>))}
            </Swiper>
          }
        </h2>
      ) : (
        <p className="text-gray-500">No listing found.</p>
      )}
    </div>
  );
}
