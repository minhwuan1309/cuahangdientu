import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const initialLocation = {
  lat: 10.762622, // Vĩ độ mặc định
  lng: 106.69588, // Kinh độ mặc định
};

const MapComponent = () => {
  const [location, setLocation] = useState(initialLocation);
  const [address, setAddress] = useState(
    "Khu Công nghệ cao XL Hà Nội, Hiệp Phú, Quận 9, Hồ Chí Minh, Vietnam"
  );

  useEffect(() => {
    const geocoder = new window.google.maps.Geocoder();

    if (address) {
      geocoder.geocode({ address: address }, (results, status) => {
        if (status === "OK") {
          const newLocation = results[0].geometry.location;
          setLocation({
            lat: newLocation.lat(),
            lng: newLocation.lng(),
          });
        } else {
          console.error(
            "Geocode was not successful for the following reason: " + status
          );
        }
      });
    }
  }, [address]); // Mỗi khi `address` thay đổi, Google Maps sẽ cập nhật lại

  const handleAddressChange = (newAddress) => {
    setAddress(newAddress); // Cập nhật địa chỉ và trigger lại Geocode
  };

  return (
    <div>
      <h3 className="mb-[20px] mt-8 text-[15px] font-medium border-l-2 border-main pl-[15px]">
        VỀ CHÚNG TÔI
      </h3>

      {/* Địa chỉ với ID */}
      <span
        id="address"
        onClick={() => handleAddressChange("Địa chỉ mới, Thành phố, Quốc gia")}
      >
        <span>Địa chỉ: </span>
        <span className="opacity-70">{address}</span>
      </span>

      {/* Tích hợp Google Map */}
      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={location}
          zoom={15}
        >
          <Marker position={location} />
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default MapComponent;
