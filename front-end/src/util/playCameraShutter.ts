import cameraShutter from '../assets/audio/camera_shutter.mp3';

const playCameraShutter = () => {
  const audio = new Audio(cameraShutter);
  audio.play();
};

export default playCameraShutter; 