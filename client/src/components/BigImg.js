import styles from '../styles/BigImg.module.css'

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
        className={styles.bigImg}
        />
    );
};

export default BigImg;
