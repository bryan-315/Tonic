// src/components/DrinkImage.js
import React from 'react';


const BigImg = ({ url, alt = '' }) => {
  // Expects a Cloudinary URL as a prop
  // Resize the image to 500x500 pixels, crop it to fill, and center it
    const transformed = url.replace(
        '/upload/',
        '/upload/w_500,h_500,c_fill,g_auto/'
    );

    return (
        <img
        src={transformed}
        alt={alt}
        style={{
            width: '100%',        // responsive width
            maxWidth: '250px',    // don't grow too large
            aspectRatio: '1 / 1', // maintain square box
            objectFit: 'cover',   // crop to fill
            display: 'block',
            margin: '0 auto',     // center
        }}
        />
    );
};

export default BigImg;
